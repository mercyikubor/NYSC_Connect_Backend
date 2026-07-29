import sequelize from "../config/db.js";
import User from "./user.js";
import CorpsMember from "./corpsMember.js";
import Business from "./business.js";

// CorpMember Association (One-to-One)
User.hasOne(CorpsMember, {
  foreignKey: "userId",
});

CorpsMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Business Association (One-to-One)
User.hasOne(Business, {
  foreignKey: "userId",
});

Business.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { sequelize, User, CorpsMember, Business };
