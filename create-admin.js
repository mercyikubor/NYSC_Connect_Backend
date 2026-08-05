import { User } from "./src/models/index.js";
import "dotenv/config";

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: {
        email: process.env.ADMIN_EMAIL,
      },
    });
    if (existingAdmin) {
      process.exit(0);
    }
    // Create a new admin
    await User.create({
      fullName: process.env.ADMIN_FULL_NAME,
      email: process.env.ADMIN_EMAIL,
      phoneNumber: process.env.ADMIN_PHONE,
      password: process.env.ADMIN_PASSWORD,
      role: "Admin",
      isEmailVerified: true,
      isOnboardingComplete: true,
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
