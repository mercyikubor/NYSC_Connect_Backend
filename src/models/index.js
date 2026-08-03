import sequelize from "../config/db.js";

import defineUser from "./user.model.js";
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