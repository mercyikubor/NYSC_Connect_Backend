import sequelize from "../config/db.js";
import User from "./user.js";
import CorpsMember from "./corpsMember.js";
import Landlord from "./landlord.js";
import Property from "./property.js";
import Business from "./business.js";

// User ↔ CorpsMember
User.hasOne(CorpsMember, {
  foreignKey: "userId",
  as: "corpsMember",
  onDelete: "CASCADE",
});

CorpsMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// User ↔ Business
User.hasOne(Business, {
  foreignKey: "sellerId",
});

Business.belongsTo(User, {
  foreignKey: "sellerId",
  as: "user",
});

// Landlord ↔ Property
Landlord.hasMany(Property, {
  foreignKey: "landlordId",
  as: "properties",
  onDelete: "CASCADE",
});

Property.belongsTo(Landlord, {
  foreignKey: "landlordId",
  as: "landlord",
});

export {
  sequelize,
  User,
  CorpsMember,
  Business,
  Landlord,
  Property,
};

export default {
  sequelize,
  User,
  CorpsMember,
  Business,
  Landlord,
  Property,
};