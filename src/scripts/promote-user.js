// Run with: node src/scripts/promote-user.js <mode> <userId> [communityId]
//
// Examples:
//   node src/scripts/promote-user.js site-admin <userId>
//   node src/scripts/promote-user.js community-leader <userId> <communityId>
//   node src/scripts/promote-user.js community-admin <userId> <communityId>

import models, { sequelize } from "../models/index.js";

const { User, CommunityMember } = models;

const [, , mode, userId, communityId] = process.argv;

const run = async () => {
  try {
    if (mode === "site-admin") {
      if (!userId) throw new Error("Usage: promote-user.js site-admin <userId>");

      const user = await User.findByPk(userId);
      if (!user) throw new Error(`No user found with id ${userId}`);

      user.role = "Admin";
      await user.save();
      console.log(`User ${userId} is now a site-wide Admin.`);
    } else if (mode === "community-leader" || mode === "community-admin") {
      if (!userId || !communityId) {
        throw new Error(
          "Usage: promote-user.js community-leader|community-admin <userId> <communityId>"
        );
      }

      const membership = await CommunityMember.findOne({
        where: { userId, communityId },
      });

      if (!membership) {
        throw new Error(
          "No membership found - the user must join the community first."
        );
      }

      membership.role = mode === "community-admin" ? "admin" : "leader";
      await membership.save();
      console.log(
        `User ${userId} is now a "${membership.role}" in community ${communityId}.`
      );
    } else {
      console.log(
        "Usage:\n" +
          "  node src/scripts/promote-user.js site-admin <userId>\n" +
          "  node src/scripts/promote-user.js community-leader <userId> <communityId>\n" +
          "  node src/scripts/promote-user.js community-admin <userId> <communityId>"
      );
    }
  } catch (error) {
    console.error("Promote failed:", error.message);
  } finally {
    await sequelize.close();
  }
};

run();