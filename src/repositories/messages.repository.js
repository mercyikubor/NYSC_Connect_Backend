import { Op } from "sequelize";
import models from "../models/index.js";

const { Message, CommunityMember, Block, User } = models;

const messagesRepository = {
  async isCommunityMember(communityId, userId) {
    const membership = await CommunityMember.findOne({
      where: { communityId, userId },
    });
    return Boolean(membership);
  },

  async isBlockedEitherWay(userIdA, userIdB) {
    const block = await Block.findOne({
      where: {
        [Op.or]: [
          { blockerId: userIdA, blockedId: userIdB },
          { blockerId: userIdB, blockedId: userIdA },
        ],
      },
    });
    return Boolean(block);
  },

  async createCommunityMessage({
    communityId,
    senderId,
    content,
    attachments = [],
  }) {
    return Message.create({
      type: "community",
      communityId,
      senderId,
      content,
      attachments,
    });
  },

  async createDirectMessage({
    senderId,
    receiverId,
    content,
    attachments = [],
  }) {
    return Message.create({
      type: "direct",
      senderId,
      receiverId,
      content,
      attachments,
    });
  },

  async getCommunityMessages(communityId, { page = 1, limit = 30 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Message.findAndCountAll({
      where: { type: "community", communityId },
      include: [
        { model: User, as: "sender", attributes: ["id", "fullName"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      // Reversed so the client renders oldest -> newest, like a normal chat
      messages: rows.reverse(),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getDirectMessages(userIdA, userIdB, { page = 1, limit = 30 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Message.findAndCountAll({
      where: {
        type: "direct",
        [Op.or]: [
          { senderId: userIdA, receiverId: userIdB },
          { senderId: userIdB, receiverId: userIdA },
        ],
      },
      include: [
        { model: User, as: "sender", attributes: ["id", "fullName"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      messages: rows.reverse(),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },
};

export default messagesRepository;