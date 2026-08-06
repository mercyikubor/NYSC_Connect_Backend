import sequelize from "../config/db.js";
<<<<<<< HEAD

import defineUser from "./user.js";
import defineCommunity from "./community.model.js";
import defineCommunityMember from "./communityMember.model.js";
import definePost from "./post.model.js";
import defineComment from "./comment.model.js";
import defineAnnouncement from "./announcement.model.js";
import defineGroup from "./group.model.js";
import defineGroupMember from "./groupMember.model.js";
import defineMessage from "./message.model.js";
import defineBlock from "./block.model.js";

const models = {
  User: defineUser(sequelize),
  Community: defineCommunity(sequelize),
  CommunityMember: defineCommunityMember(sequelize),
  Post: definePost(sequelize),
  Comment: defineComment(sequelize),
  Announcement: defineAnnouncement(sequelize),
  Group: defineGroup(sequelize),
  GroupMember: defineGroupMember(sequelize),
  Message: defineMessage(sequelize),
  Block: defineBlock(sequelize),
};

// Wire up associations after every model has been defined,
// so cross-references (e.g. Community -> User) resolve correctly.
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

export { sequelize };
export default models;
=======
import User from "./user.js";
import CorpsMember from "./corpsMember.js";
import State from "./state.js";
import LGA from "./lga.js";
import Landlord from "./landlord.js";
import Property from "./property.js";
import Admin from "./admin.js";

// User -> CorpsMember Association (One-to-One)
User.hasOne(CorpsMember, {
  foreignKey: "userId",
  as: "corpsMember",
  onDelete: "CASCADE",
  hooks: true,
});

CorpsMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// State -> LGA Association (One-to-Many)
State.hasMany(LGA, {
  foreignKey: "stateId",
  as: "lgas",
});

LGA.belongsTo(State, {
  foreignKey: "stateId",
  as: "state",
});

// State -> CorpsMember Association (One-to-Many)
State.hasMany(CorpsMember, {
  foreignKey: "stateId",
  as: "corpsMembers",
});
CorpsMember.belongsTo(State, {
  foreignKey: "stateId",
  as: "state",
});

// LGA -> CorpsMember Association (One-to-Many)
LGA.hasMany(CorpsMember, {
  foreignKey: "lgaId",
  as: "corpsMembers",
});
CorpsMember.belongsTo(LGA, {
  foreignKey: "lgaId",
  as: "lga",
});

// Landlord ↔ Property
Landlord.hasMany(Property, {
  foreignKey: "landlordId",
  as: "properties",
  onDelete: "CASCADE",
  hooks: true,
});

Property.belongsTo(Landlord, {
  foreignKey: "landlordId",
  as: "landlord",
});
export { sequelize, User, CorpsMember, State, LGA, Landlord, Property, Admin };
>>>>>>> e472868f082e23583c2049879d930244f02dd7af
