import User from "./User.js";
import CorpsMemberProfile from "./corpsMembersProfiles-model.js";


User.hasOne(CorpsMemberProfile, { foreignKey: "userId", as: "profile" });
CorpsMemberProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

export { User, CorpsMemberProfile };