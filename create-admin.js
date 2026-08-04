import { User } from "./src/models/index.js";

const createAdmin = async () => {
  try {
    // Delete existing admin if it exists
    await User.destroy({
      where: {
        email: "admin@nyscconnect.com",
      },
    });

    // Create a new admin
    const admin = await User.create({
      fullName: "System Admin",
      email: "admin@nyscconnect.com",
      phoneNumber: "08011111111",
      password: "Admin123!", // Will be hashed automatically
      role: "Admin",
      isEmailVerified: true,
      isOnboardingComplete: true,
    });

    console.log("✅ Admin created successfully!");
    console.log(admin.email);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();