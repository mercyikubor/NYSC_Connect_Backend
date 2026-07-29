import { User, CorpsMember, sequelize } from "../models/index.js";
import { sendOnboardingOtpEmail } from "../services/email-services.js";
import bcrypt from "bcrypt";
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
  // check if call-up number already exists
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
  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }
  return {
    success: true,
    message: "Login successful.",
    data: {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
