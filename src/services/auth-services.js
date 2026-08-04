import { User, CorpsMember, Landlord, sequelize } from "../models/index.js";
import { sendOnboardingOtpEmail } from "../services/email-services.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generate-token.js";
import { sendPasswordResetOtpEmail } from "../services/email-services.js";

export const registerCorpsMember = async (data) => {
  const { fullName, email, phoneNumber, password, callUpNumber } = data;
  // check if email already exists
  const existingUser = await User.findOne({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new Error("Email already exists.");
  }
  // check if call-up number already exists;///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const existingCorpsMember = await CorpsMember.findOne({
    where: {
      callUpNumber,
    },
  });
  if (existingCorpsMember) {
    throw new Error("Call-up number already exists.");
  }
  // Generate otp
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  // Generate otp expiry time (10 minutes)
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  // Start transaction
  const transaction = await sequelize.transaction();
  try {
    //Create the User account
    const newUser = await User.create(
      {
        fullName,
        phoneNumber,
        email,
        password,
        role: "Corps_members",
        emailVerificationOtp: otpCode,
        emailVerificationOtpExpiresAt: otpExpiresAt,
      },
      { transaction },
    );
    // Create the Corps Member profile
    const newProfile = await CorpsMember.create(
      {
        userId: newUser.id,
        callUpNumber,
      },
      { transaction },
    );
    const emailResult = await sendOnboardingOtpEmail(
      email,
      fullName,
      otpCode,
      "Corps_members",
    );
    if (!emailResult.success) {
      throw new Error("Failed to send verification email.");
    }
    await transaction.commit();
    return {
      success: true,
      message: "Corps Member registered successfully",
      data: {
        userId: newUser.id,
        profileId: newProfile.id,
      },
    };
  } catch (error) {
    await transaction.rollback();

    console.error("========== REGISTER ERROR ==========");
    console.error(error);
    console.error(error.parent);
    console.error(error.original);

    throw error;
  }
};
// verify email address and update user verification status.
export const verifyEmail = async (data) => {
  const { email, otp } = data;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }
  if (user.isEmailVerified) {
    throw new Error("Email is already verified.");
  }
  if (user.emailVerificationOtp !== otp) {
    throw new Error("Invalid OTP.");
  }
  if (new Date() > user.emailVerificationOtpExpiresAt) {
    throw new Error("OTP has expired.");
  }
  await user.update({
    isEmailVerified: true,
    emailVerificationOtp: null,
    emailVerificationOtpExpiresAt: null,
  });
  return {
    success: true,
    message: "Email verified successfully.",
  };
};

export const requestPasswordReset = async (data) => {
  const { email } = data;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // OTP expires in 10 minutes
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await user.update({
    passwordResetOtp: otpCode,
    passwordResetOtpExpiresAt: otpExpiresAt,
  });

  // Send password reset email
  const emailResult = await sendPasswordResetOtpEmail(
    user.email,
    user.fullName,
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

// Login user
export const login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  console.log("Entered password:", password);
  console.log("Stored hash:", user.password);
  console.log("Password valid:", isPasswordValid);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    success: true,
    message: "Login successful.",
    token,
    data: {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const resetPassword = async (data) => {
  const { email, otp, newPassword } = data;
  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    throw new Error("User not found.");
  }
  if (user.passwordResetOtp !== otp) {
    throw new Error("Invalid OTP.");
  }
  if (new Date() > user.passwordResetOtpExpiresAt) {
    throw new Error("OTP has expired.");
  }
  await user.update({
    password: newPassword,
    passwordResetOtp: null,
    passwordResetOtpExpiresAt: null,
  });
  return {
    success: true,
    message: "Password reset successfully.",
  };
};

export const registerLandlord = async (data, files) => {
  const { fullName, email, phone, password } = data;

  if (!files || !files.selfie || !files.validId) {
    throw new Error("Both selfie and valid ID images are required.");
  }

  const existingLandlord = await Landlord.findOne({
    where: { email },
  });

  if (existingLandlord) {
    throw new Error("A landlord with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newLandlord = await Landlord.create({
    fullName,
    email,
    phone,
    password: hashedPassword,
    selfieUrl: files.selfie[0].path,
    validIdUrl: files.validId[0].path,
    isVerified: false,
    verificationStatus: "PENDING",
  });

  return {
    success: true,
    message:
      "Landlord registered successfully. Verification is pending approval.",
    data: {
      id: newLandlord.id,
      fullName: newLandlord.fullName,
      email: newLandlord.email,
      verificationStatus: newLandlord.verificationStatus,
    },
  };
};

export const loginLandlord = async (data) => {
  const { email, password } = data;

  console.log("Email entered:", email);
  console.log("Password entered:", password);

  const landlord = await Landlord.findOne({
    where: { email },
  });

  console.log(
    "Landlord found:",
    landlord ? landlord.email : "No landlord found",
  );

  if (!landlord) {
    throw new Error("Invalid email or password.");
  }

  console.log("Stored hash:", landlord.password);

  const isPasswordValid = await bcrypt.compare(password, landlord.password);

  console.log("Password Match:", isPasswordValid);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
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
      role: "Landlords",
      verificationStatus: landlord.verificationStatus,
    },
  };
};
