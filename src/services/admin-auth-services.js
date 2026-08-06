import bcrypt from "bcrypt";
import { Admin } from "../models/index.js";
import { generateToken } from "../utils/generate-token.js";

export const loginAdmin = async (data) => {
  const { email, password } = data;

  const admin = await Admin.findOne({
    where: { email },
  });

  if (!admin) {
    throw new Error("Invalid email or password.");
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken({
    adminId: admin.id,
    role: "Admin",
  });

  return {
    success: true,
    message: "Admin login successful.",
    token,
    data: {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
    },
  };
};
