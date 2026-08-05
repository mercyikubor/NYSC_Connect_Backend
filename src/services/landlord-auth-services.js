import { Landlord } from "../models/index.js";
import {
  sendOnboardingOtpEmail,
  sendPasswordResetOtpEmail,
} from "./email-services.js";
import { generateOtp } from "../utils/generate-otp.js";
import { generateToken } from "../utils/generate-token.js";
import bcrypt from "bcrypt";

export const registerLandlord = async (data, files) => {
  const {
    fullName,
    email,
    phone,
    password,
  } = data;


  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = phone?.trim();

 
  if (!fullName?.trim()) {
    throw new Error("Full name is required.");
  }

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  if (!normalizedPhone) {
    throw new Error("Phone number is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

 
  const existingLandlord = await Landlord.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingLandlord) {
    throw new Error("A landlord with this email already exists.");
  }

 
  if (!files?.selfie?.length) {
    throw new Error("A selfie is required for identity verification.");
  }


  if (!files?.validId?.length) {
    throw new Error(
      "A valid government-issued ID is required for identity verification."
    );
  }

  const selfieFile = files.selfie[0];
  const validIdFile = files.validId[0];

 
  const selfieUrl = selfieFile.path;
  const validIdUrl = validIdFile.path;

  if (!selfieUrl || !validIdUrl) {
    throw new Error("Unable to process verification documents.");
  }

 
  const { otpCode, otpExpiresAt } = generateOtp();


  const hashedPassword = await bcrypt.hash(password, 10);

  let landlord;

  try {
    landlord = await Landlord.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,

      selfieUrl,
      validIdUrl,

      isEmailVerified: false,

      emailVerificationOtp: otpCode,
      emailVerificationOtpExpiresAt: otpExpiresAt,

      verificationStatus: "PENDING",
      rejectionReason: null,
    });

  
    const emailResult = await sendOnboardingOtpEmail(
      normalizedEmail,
      fullName.trim(),
      otpCode,
      "Landlords"
    );

    if (!emailResult.success) {

      await landlord.destroy();

      throw new Error("Failed to send landlord verification email.");
    }

    return {
      success: true,
      message:
        "Landlord registered successfully. Please verify your email. Your identity documents are awaiting review.",
      data: {
        id: landlord.id,
        fullName: landlord.fullName,
        email: landlord.email,
        isEmailVerified: landlord.isEmailVerified,
        verificationStatus: landlord.verificationStatus,
      },
    };
  } catch (error) {
    console.error("========== LANDLORD REGISTER ERROR ==========");
    console.error(error);

    throw error;
  }
};

export const verifyLandlordEmail = async (data) => {
  const { email, otp } = data;

  const normalizedEmail = email?.trim().toLowerCase();

  const landlord = await Landlord.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (landlord.isEmailVerified) {
    throw new Error("Email is already verified.");
  }

  if (!landlord.emailVerificationOtp) {
    throw new Error(
      "No verification OTP exists. Please request a new OTP."
    );
  }

  if (String(landlord.emailVerificationOtp) !== String(otp)) {
    throw new Error("Invalid OTP.");
  }

  if (
    !landlord.emailVerificationOtpExpiresAt ||
    new Date() > new Date(landlord.emailVerificationOtpExpiresAt)
  ) {
    throw new Error("OTP has expired. Please request a new OTP.");
  }

  await landlord.update({
    isEmailVerified: true,
    emailVerificationOtp: null,
    emailVerificationOtpExpiresAt: null,
  });

  return {
    success: true,
    message:
      "Email verified successfully. Your identity verification is awaiting admin approval.",
    data: {
      id: landlord.id,
      email: landlord.email,
      isEmailVerified: true,
      verificationStatus: landlord.verificationStatus,
    },
  };
};

export const resendLandlordVerificationOtp = async (data) => {
  const { email } = data;

  const normalizedEmail = email?.trim().toLowerCase();

  const landlord = await Landlord.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (landlord.isEmailVerified) {
    throw new Error("Email is already verified.");
  }

  const { otpCode, otpExpiresAt } = generateOtp();

  await landlord.update({
    emailVerificationOtp: otpCode,
    emailVerificationOtpExpiresAt: otpExpiresAt,
  });

  const emailResult = await sendOnboardingOtpEmail(
    landlord.email,
    landlord.fullName,
    otpCode,
    "Landlords"
  );

  if (!emailResult.success) {
    throw new Error("Failed to send landlord verification OTP.");
  }

  return {
    success: true,
    message: "Landlord verification OTP sent successfully.",
  };
};

export const loginLandlord = async (data) => {
  const { email, password } = data;

  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required.");
  }

  const landlord = await Landlord.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (!landlord) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    landlord.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  // Email must be verified
  if (!landlord.isEmailVerified) {
    throw new Error(
      "Please verify your email before logging in."
    );
  }

  // Normalize because older DB records may use lowercase
  const verificationStatus =
    landlord.verificationStatus?.toUpperCase();

  // Admin has not reviewed documents yet
  if (verificationStatus === "PENDING") {
    throw new Error(
      "Your identity verification is still pending admin approval."
    );
  }

  // Admin rejected documents
  if (verificationStatus === "REJECTED") {
    throw new Error(
      landlord.rejectionReason ||
        "Your landlord identity verification was rejected."
    );
  }

  if (verificationStatus !== "APPROVED") {
    throw new Error(
      "Your landlord account has not been approved."
    );
  }

  const token = generateToken({
    userId: landlord.id,
    role: "Landlords",
    userType: "landlord",
  });

  return {
    success: true,
    message: "Landlord login successful.",
    token,
    data: {
      id: landlord.id,
      fullName: landlord.fullName,
      email: landlord.email,
      phone: landlord.phone,
      role: "Landlords",
      isEmailVerified: landlord.isEmailVerified,
      verificationStatus: landlord.verificationStatus,
    },
  };
};

export const requestLandlordPasswordReset = async (data) => {
  const { email } = data;

  const normalizedEmail = email?.trim().toLowerCase();

  const landlord = await Landlord.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  const { otpCode, otpExpiresAt } = generateOtp();

  await landlord.update({
    passwordResetOtp: otpCode,
    passwordResetOtpExpiresAt: otpExpiresAt,
  });

  const emailResult = await sendPasswordResetOtpEmail(
    landlord.email,
    landlord.fullName,
    otpCode
  );

  if (!emailResult.success) {
    throw new Error("Failed to send password reset email.");
  }

  return {
    success: true,
    message: "Landlord password reset OTP sent successfully.",
  };
};

export const resetLandlordPassword = async (data) => {
  const {
    email,
    otp,
    newPassword,
  } = data;

  const normalizedEmail = email?.trim().toLowerCase();

  const landlord = await Landlord.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (!landlord.passwordResetOtp) {
    throw new Error(
      "No password reset request exists. Please request a new OTP."
    );
  }

  if (String(landlord.passwordResetOtp) !== String(otp)) {
    throw new Error("Invalid OTP.");
  }

  if (
    !landlord.passwordResetOtpExpiresAt ||
    new Date() > new Date(landlord.passwordResetOtpExpiresAt)
  ) {
    throw new Error(
      "Password reset OTP has expired. Please request a new OTP."
    );
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error(
      "New password must be at least 8 characters long."
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await landlord.update({
    password: hashedPassword,
    passwordResetOtp: null,
    passwordResetOtpExpiresAt: null,
  });

  return {
    success: true,
    message: "Landlord password reset successfully.",
  };
};

export const approveLandlord = async (landlordId) => {
  const landlord = await Landlord.findByPk(landlordId);

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (!landlord.isEmailVerified) {
    throw new Error(
      "Landlord email must be verified before approval."
    );
  }

  if (!landlord.selfieUrl) {
    throw new Error(
      "Landlord does not have a verification selfie."
    );
  }

  if (!landlord.validIdUrl) {
    throw new Error(
      "Landlord does not have a valid ID document."
    );
  }

  await landlord.update({
    verificationStatus: "APPROVED",
    rejectionReason: null,
  });

  return {
    success: true,
    message: "Landlord approved successfully.",
    data: {
      id: landlord.id,
      fullName: landlord.fullName,
      email: landlord.email,
      verificationStatus: landlord.verificationStatus,
    },
  };
};

export const rejectLandlord = async (
  landlordId,
  rejectionReason
) => {
  const landlord = await Landlord.findByPk(landlordId);

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (!rejectionReason?.trim()) {
    throw new Error(
      "A rejection reason is required."
    );
  }

  await landlord.update({
    verificationStatus: "REJECTED",
    isVerified: false,
    rejectionReason:
     rejectionReason ||  "Verification failed. One or more submitted documents could not be verified.",
     verifiedAt: new Date(),
     verifiedBy: "Admin",

  });

  return {
    success: true,
    message: "Landlord verification rejected.",
    data: {
      id: landlord.id,
      fullName: landlord.fullName,
      email: landlord.email,
      verificationStatus: landlord.verificationStatus,
      rejectionReason: landlord.rejectionReason,
    },
  };
};