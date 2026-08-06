// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { User } from "../models/index.js";

// /**
//  * Verifies email + password and returns a signed JWT plus the safe
//  * (password-excluded) user object.
//  *
//  * @param {string} email
//  * @param {string} password
//  * @returns {Promise<{ token: string, user: object }>}
//  */
// export const login = async (email, password) => {
//   if (!email || !password) {
//     throw new Error("Email and password are required.");
//   }

//   const user = await User.findOne({ where: { email } });

//   if (!user) {
//     throw new Error("Invalid email or password.");
//   }

//   const passwordMatches = await bcrypt.compare(password, user.password);

//   if (!passwordMatches) {
//     throw new Error("Invalid email or password.");
//   }

//   const token = jwt.sign(
//     { id: user.id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" },
//   );

//   const safeUser = user.toJSON();
//   delete safeUser.password;

//   return { token, user: safeUser };
// };