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


    async getChats(userId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

   

    const messages = await Message.findAll({
      where: {
        type: "direct",
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "fullName"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "fullName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });


    const chatsMap = new Map();


    for (const message of messages) {
      const otherUser =
        message.senderId === userId
          ? message.receiver
          : message.sender;


      if (!otherUser) continue;


      if (!chatsMap.has(otherUser.id)) {
        const unreadCount = await Message.count({
          where: {
            type: "direct",
            senderId: otherUser.id,
            receiverId: userId,
            readAt: null,
          },
        });


        chatsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
          },
          unreadCount,
        });
      }
    }


    const chats = Array.from(chatsMap.values());


    return {
      chats: chats.slice(offset, offset + limit),
      pagination: {
        total: chats.length,
        page,
        limit,
        totalPages: Math.ceil(chats.length / limit),
      },
    };
  },


  async searchChats(userId, search, { limit = 20 } = {}) {
    const messages = await Message.findAll({
      where: {
        type: "direct",
        [Op.or]: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "fullName"],
          where: {
            fullName: {
              [Op.like]: `%${search}%`,
            },
          },
          required: false,
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "fullName"],
          where: {
            fullName: {
              [Op.like]: `%${search}%`,
            },
          },
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });


    const users = new Map();


    for (const message of messages) {
      const otherUser =
        message.senderId === userId
          ? message.receiver
          : message.sender;


      if (otherUser && !users.has(otherUser.id)) {
        users.set(otherUser.id, otherUser);
      }
    }


    return Array.from(users.values());
  },



  // Searching for a message
    async searchMessages(
    userIdA,
    userIdB,
    search,
    { page = 1, limit = 30 } = {}
  ) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Message.findAndCountAll({
      where: {
        type: "direct",
        [Op.and]: [
          {
            [Op.or]: [
              {
                senderId: userIdA,
                receiverId: userIdB,
              },
              {
                senderId: userIdB,
                receiverId: userIdA,
              },
            ],
          },
          {
            content: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "fullName"],
        },
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


  // Indicating read 
  async markMessagesAsRead(senderId, receiverId) {
    const [updatedCount] = await Message.update(
      {
        readAt: new Date(),
      },
      {
        where: {
          type: "direct",
          senderId,
          receiverId,
          readAt: null,
        },
      }
    );

    return {
      updatedCount,
    };
  },
};

export default messagesRepository;