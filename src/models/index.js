import sequelize from "../config/db.js";
import User from "./user.js";
import CorpsMember from "./corpsMember.js";

// CorpMember Association (One-to-One)
User.hasOne(CorpsMember, {
  foreignKey: "userId",
});

CorpsMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


export { sequelize, User, CorpsMember };
