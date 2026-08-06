import { User, CorpsMember, sequelize } from "../models/index.js";
import {
  sendOnboardingOtpEmail,
  sendPasswordResetOtpEmail,
} from "../services/email-services.js";
import { generateOtp } from "../utils/generate-otp.js";
import { verifyNYSC } from "../services/prembly-services.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generate-token.js";

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
  //Real Prembly verification (disabled temporarily because the service is down)
  // Mock verification is enabled temporarily because the service is down. Set MOCK_PREMBLY_VERIFICATION to false to disable mock verification.
  let verificationResult;

  if (process.env.MOCK_PREMBLY_VERIFICATION === "true") {
    verificationResult = {
      success: true,
      message: "Mock NYSC verification successful",
      data: {
        verified: true,
        nysc_number: callUpNumber,
      },
    };
  } else {
    verificationResult = await verifyNYSC(callUpNumber);
    if (!verificationResult.success) {
      throw new Error(
        verificationResult.message || "NYSC verification failed.",
      );
    }
  }
  //Generate otp
  const { otpCode, otpExpiresAt } = generateOtp();

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
        verificationStatus: verificationResult.data.verified
          ? "VERIFIED"
          : "REJECTED",
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
// verify email address
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
// Resend verification otp
export const resendVerificationOtp = async (data) => {
  const { email } = data;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }
  if (user.isEmailVerified) {
    throw new Error("Email is already verified.");
  }

  // Generate a new OTP
  const { otpCode, otpExpiresAt } = generateOtp();

  await user.update({
    emailVerificationOtp: otpCode,
    emailVerificationOtpExpiresAt: otpExpiresAt,
  });
  const emailResult = await sendOnboardingOtpEmail(
    user.email,
    user.fullName,
    otpCode,
    user.role,
  );
  if (!emailResult.success) {
    throw new Error("Failed to send verification email.");
  }
  return {
    success: true,
    message: "Verification OTP sent successfully.",
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

export const requestPasswordReset = async (data) => {
  const { email } = data;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // Generate OTP for password reset
  const { otpCode, otpExpiresAt } = generateOtp();
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
    throw new Error("OTP has TokenExpiredError.");
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
