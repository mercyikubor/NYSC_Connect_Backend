

import "dotenv/config";
import sequelize from "../config/db.js";
import { User } from "../models/index.js";

const ADMIN_DETAILS = {
  fullName: "System Admin",
  email: "admin@nyscconnect.com",
  phoneNumber: "08000000000",
  password: "ChangeThisPassword123!", // hashed automatically by the User model's beforeCreate hook
  role: "Admin",
  isEmailVerified: true,
  isOnboardingComplete: true,
};

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();

    const existing = await User.findOne({ where: { email: ADMIN_DETAILS.email } });
    if (existing) {
      console.log(`Admin already exists with email: ${ADMIN_DETAILS.email}`);
      process.exit(0);
    }

    const admin = await User.create(ADMIN_DETAILS);
    console.log("Admin user created successfully:");
    console.log({ id: admin.id, email: admin.email, role: admin.role });
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();