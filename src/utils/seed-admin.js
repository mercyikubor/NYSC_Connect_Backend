import bcrypt from "bcrypt";
import { Admin } from "../models/index.js";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({
      where: {
        email: process.env.ADMIN_EMAIL,
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Admin.create({
      fullName: process.env.ADMIN_FULL_NAME,
      email: process.env.ADMIN_EMAIL,
      phone: process.env.ADMIN_PHONE,
      password: hashedPassword,
    });

    console.log("Default admin created successfully.");
  } catch (error) {
    console.error("Failed to seed admin:", error);
  }
};
