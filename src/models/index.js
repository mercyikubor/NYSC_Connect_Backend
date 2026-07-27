import sequelize from "../config/db.js";
import user from "./user.js";

// CorpMember Association (One-to-One)
User.hasOne(CorpsMembersProfile, {
  foreignKey: "UserId",
});

CorpsMembersProfile.belongsTo(User, {
  foreignKey: "userId",
});
