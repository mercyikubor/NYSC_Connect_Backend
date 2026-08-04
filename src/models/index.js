import sequelize from "../config/db.js";
import User from "./user.js";
import CorpsMember from "./corpsMember.js";
import State from "./state.js";
import LGA from "./lga.js";

// User -> CorpsMember Association (One-to-One)
User.hasOne(CorpsMember, {
  foreignKey: "userId",
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

export { sequelize, User, CorpsMember, State, LGA };
