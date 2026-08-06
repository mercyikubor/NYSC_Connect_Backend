import bcrypt from "bcrypt";

import { Landlord, sequelize } from "../models/index.js";

import {
  sendOnboardingOtpEmail,
  sendPasswordResetOtpEmail,
} from "./email-services.js";

import { generateOtp } from "../utils/generate-otp.js";
import { generateToken } from "../utils/generate-token.js";

// Register a new landlord
export const registerLandlord = async (data, files) => {
  const { fullName, email, phone, password } = data;

  // Check if landlord already exists
  const existingLandlord = await Landlord.findOne({
    where: { email },
  });

  if (existingLandlord) {
    throw new Error("Email already exists.");
  }

  // Validate uploads
  if (!files?.selfie?.length) {
    throw new Error("A selfie is required.");
  }

  if (!files?.validId?.length) {
    throw new Error("A valid government-issued ID is required.");
  }

  // Generate OTP
  const { otpCode, otpExpiresAt } = generateOtp();

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const transaction = await sequelize.transaction();

  try {
    const landlord = await Landlord.create(
      {
        fullName,
        email,
        phone,
        password: hashedPassword,

        selfieUrl: files.selfie[0].path,
        validIdUrl: files.validId[0].path,

        verificationStatus: "PENDING",
        rejectionReason: null,

        isEmailVerified: false,
        isIdentityVerified: false,

        emailVerificationOtp: otpCode,
        emailVerificationOtpExpiresAt: otpExpiresAt,

        passwordResetOtp: null,
        passwordResetOtpExpiresAt: null,

        verifiedAt: null,
      },
      { transaction },
    );

    // Send verification email
    const emailResult = await sendOnboardingOtpEmail(
      landlord.email,
      landlord.fullName,
      otpCode,
      "Landlords",
    );

    if (!emailResult.success) {
      throw new Error("Failed to send verification email.");
    }

    await transaction.commit();

    return {
      success: true,
      message:
        "Registration successful. Please verify your email before logging in.",

      data: {
        landlordId: landlord.id,
        email: landlord.email,
        verificationStatus: landlord.verificationStatus,
      },
    };
  } catch (error) {
    await transaction.rollback();

    console.error("========== LANDLORD REGISTRATION ERROR ==========");
    console.error(error);

    throw error;
  }
};

export const verifyLandlordEmail = async (data) => {
  const { email, otp } = data;

  const landlord = await Landlord.findOne({
    where: { email },
  });

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (landlord.isEmailVerified) {
    throw new Error("Email is already verified.");
  }

  if (landlord.emailVerificationOtp !== otp) {
    throw new Error("Invalid OTP.");
  }

  if (new Date() > landlord.emailVerificationOtpExpiresAt) {
    throw new Error("OTP has expired.");
  }

  await landlord.update({
    isEmailVerified: true,
    emailVerificationOtp: null,
    emailVerificationOtpExpiresAt: null,
  });

  return {
    success: true,
    message:
      "Email verified successfully. Your account is now awaiting identity verification by the admin.",
  };
};

export const resendLandlordVerificationOtp = async (data) => {
  const { email } = data;

  const landlord = await Landlord.findOne({
    where: { email },
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
    "Landlords",
  );

  if (!emailResult.success) {
    throw new Error("Failed to send verification email.");
  }

  return {
    success: true,
    message: "A new verification code has been sent to your email.",
  };
};

export const loginLandlord = async (data) => {
  const { email, password } = data;

  const landlord = await Landlord.findOne({
    where: { email },
  });

  if (!landlord) {
    throw new Error("Invalid email or password.");
  }

  console.log("========== LOGIN DEBUG ==========");
  console.log("Email:", landlord.email);
  console.log("Verification Status:", landlord.verificationStatus);
  console.log("Identity Verified:", landlord.isIdentityVerified);
  console.log("Email Verified:", landlord.isEmailVerified);
  console.log("================================");

  // Email verification
  if (!landlord.isEmailVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  // Identity approval
  if (landlord.verificationStatus === "PENDING") {
    const error = new Error(
      "Your identity verification is still under review.",
    );
    error.status = 403;
    throw error;
  }

  if (landlord.verificationStatus === "REJECTED") {
    const error = new Error(
      landlord.rejectionReason || "Your identity verification was rejected.",
    );
    error.status = 403;
    throw error;
  }

  if (!landlord.isIdentityVerified) {
    const error = new Error("Your identity has not yet been approved.");
    error.status = 403;
    throw error;
  }

  // Password
  const passwordMatch = await bcrypt.compare(password, landlord.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken({
    landlordId: landlord.id,
    role: "Landlord",
  });

  return {
    success: true,
    message: "Login successful.",

    token,

    data: {
      id: landlord.id,
      fullName: landlord.fullName,
      email: landlord.email,
      phone: landlord.phone,
      verificationStatus: landlord.verificationStatus,
    },
  };
};

export const requestLandlordPasswordReset = async (data) => {
  const { email } = data;

  const landlord = await Landlord.findOne({
    where: { email },
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
    otpCode,
  );

  if (!emailResult.success) {
    throw new Error("Failed to send password reset email.");
  }

  return {
    success: true,
    message: "Password reset OTP sent successfully.",
  };
};

export const resetLandlordPassword = async (data) => {
  const { email, otp, newPassword } = data;

  const landlord = await Landlord.findOne({
    where: { email },
  });

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (landlord.passwordResetOtp !== otp) {
    throw new Error("Invalid OTP.");
  }

  if (new Date() > landlord.passwordResetOtpExpiresAt) {
    throw new Error("OTP has expired.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await landlord.update({
    password: hashedPassword,
    passwordResetOtp: null,
    passwordResetOtpExpiresAt: null,
  });

  return {
    success: true,
    message: "Password reset successful.",
  };
};

export const approveLandlord = async (landlordId) => {
  const landlord = await Landlord.findByPk(landlordId);

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (landlord.verificationStatus === "APPROVED") {
    throw new Error("Landlord has already been approved.");
  }

  await landlord.update({
    verificationStatus: "APPROVED",
    isIdentityVerified: true,
    rejectionReason: null,
    verifiedAt: new Date(),
  });

  return {
    success: true,
    message: "Landlord identity approved successfully.",
    data: {
      landlordId: landlord.id,
      verificationStatus: landlord.verificationStatus,
      verifiedAt: landlord.verifiedAt,
    },
  };
};

export const rejectLandlord = async (landlordId, reason) => {
  const landlord = await Landlord.findByPk(landlordId);

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (!reason) {
    throw new Error("Rejection reason is required.");
  }

  await landlord.update({
    verificationStatus: "REJECTED",
    isIdentityVerified: false,
    rejectionReason: reason,
    verifiedAt: null,
  });

  return {
    success: true,
    message: "Landlord identity rejected.",
    data: {
      landlordId: landlord.id,
      verificationStatus: landlord.verificationStatus,
      rejectionReason: landlord.rejectionReason,
    },
  };

  const REJECTION_REASONS = {
    INVALID_ID: "The uploaded ID is invalid.",
    SELFIE_MISMATCH: "The selfie does not match the uploaded ID.",
    BLURRY_DOCUMENT: "The uploaded ID image is not clear enough.",
    EXPIRED_ID: "The uploaded ID has expired.",
    OTHER: "Your verification could not be completed. Please contact support.",
  };
};

export const resendVerificationOtp = async (data) => {
  const { email } = data;

  const landlord = await Landlord.findOne({
    where: { email },
  });

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  if (landlord.isEmailVerified) {
    throw new Error("Email is already verified.");
  }

  // Generate new OTP
  const { otpCode, otpExpiresAt } = generateOtp();

  await landlord.update({
    emailVerificationOtp: otpCode,
    emailVerificationOtpExpiresAt: otpExpiresAt,
  });

  const emailResult = await sendOnboardingOtpEmail(
    landlord.email,
    landlord.fullName,
    otpCode,
    "Landlords",
  );

  if (!emailResult.success) {
    throw new Error("Failed to send verification email.");
  }

  return {
    success: true,
    message: "Verification OTP sent successfully.",
  };
};

// Get landlord profile
export const getLandlordProfile = async (landlordId) => {
  const landlord = await Landlord.findByPk(landlordId, {
    attributes: {
      exclude: [
        "password",
        "emailVerificationOtp",
        "emailVerificationOtpExpiresAt",
        "passwordResetOtp",
        "passwordResetOtpExpiresAt",
      ],
    },
  });

  if (!landlord) {
    const error = new Error("Landlord not found.");
    error.status = 404;
    throw error;
  }

  return {
    success: true,
    data: landlord,
  };
};

// Update landlord profile
export const updateLandlordProfile = async (landlordId, data) => {
  const landlord = await Landlord.findByPk(landlordId);

  if (!landlord) {
    const error = new Error("Landlord not found.");
    error.status = 404;
    throw error;
  }

  const { fullName, phone } = data;

  await landlord.update({
    fullName: fullName ?? landlord.fullName,
    phone: phone ?? landlord.phone,
  });

  return {
    success: true,
    message: "Profile updated successfully.",
    data: {
      id: landlord.id,
      fullName: landlord.fullName,
      email: landlord.email,
      phone: landlord.phone,
      verificationStatus: landlord.verificationStatus,
    },
  };
};

export const changeLandlordPassword = async (landlordId, data) => {
  const { currentPassword, newPassword } = data;

  const landlord = await Landlord.findByPk(landlordId);

  if (!landlord) {
    throw new Error("Landlord not found.");
  }

  const passwordMatch = await bcrypt.compare(
    currentPassword,
    landlord.password,
  );

  if (!passwordMatch) {
    throw new Error("Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await landlord.update({
    password: hashedPassword,
  });

  return {
    success: true,
    message: "Password changed successfully.",
  };
};
