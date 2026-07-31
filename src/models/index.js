import sequelize from "../config/db.js";
import User from "./user.js";
import CorpsMember from "./corpsMember.js";
import Landlord from "./landlord.js";
import Property from "./property.js";

// CorpMember Association (One-to-One)
User.hasOne(CorpsMember, {
  foreignKey: "userId",
});

CorpsMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Landlord.hasMany(Property, {
  foreignKey: 'landlordId',
  as: 'properties', // Alias used when fetching landlord with their properties
  onDelete: 'CASCADE',
});
Property.belongsTo(Landlord, {
  foreignKey: 'landlordId',
  as: 'landlord',
});
export { sequelize, User, CorpsMember, Landlord, Property };
