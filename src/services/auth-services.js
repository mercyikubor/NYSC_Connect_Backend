import { User, CorpsMember, sequelize } from "../models/index.js";
import { sendOnboardingOtpEmail } from "../services/email-services.js";

export const registerCorpsMember = async (data) => {
  try {
    const { fullName, email, phoneNumber, Password, callUpNumber } = data;
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
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString;
    // Generate otp expiry time (10 minutes)
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    // Start transaction
    const transaction = await sequelize.transaction();

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
