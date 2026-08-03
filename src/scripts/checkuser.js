/**
 * One-off diagnostic: checks whether a user's stored password looks like
 * a real bcrypt hash (correct) or plain text (means the beforeCreate hook
 * never ran). Does NOT print the actual password/hash value.
 *
 * Usage:
 *   node src/scripts/checkUser.js admin@nyscconnect.com
 */

import "dotenv/config";
import sequelize from "../config/db.js";
import { User } from "../models/index.js";

const email = process.argv[2];

if (!email) {
  console.error("Usage: node src/scripts/checkUser.js <email>");
  process.exit(1);
}

const run = async () => {
  try {
    await sequelize.authenticate();

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      process.exit(0);
    }

    const looksHashed = /^\$2[aby]\$\d{2}\$/.test(user.password);

    console.log({
      id: user.id,
      email: user.email,
      role: user.role,
      passwordLength: user.password.length,
      looksLikeBcryptHash: looksHashed,
    });

    if (!looksHashed) {
      console.log(
        "\n  This password does NOT look like a bcrypt hash. " +
          "The beforeCreate hook likely isn't wired up correctly in User.js.",
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

run();