// Run with: node src/scripts/seed-test-data.js
//
// Creates (or reuses) a test user and a Lagos/Ikeja community, then prints
// a JWT you can paste straight into an Authorization header. Safe to run
// more than once - it won't create duplicate communities.

import jwt from "jsonwebtoken";
import models, { sequelize } from "../models/index.js";

const { User, Community } = models;

const run = async () => {
  try {
    const user = await User.create({
      fullName: "Test User",
      email: `test-${Date.now()}@example.com`,
      phoneNumber: "08000000000",
      password: "placeholder123",
    });

    const [community] = await Community.findOrCreate({
      where: { state: "Lagos", lga: "Ikeja" },
      defaults: {
        name: "Lagos - Ikeja Corps Community",
        createdBy: user.id,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    console.log("\n=== Seed data ready ===");
    console.log("User ID:      ", user.id);
    console.log("Community ID: ", community.id);
    console.log("JWT Token:    ", token);
    console.log("========================\n");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await sequelize.close();
  }
};

run();