import models from "../models/index.js";

const { Block, User } = models;

const blocksRepository = {
  async findUserById(userId) {
    return User.findByPk(userId);
  },

  async findBlock(blockerId, blockedId) {
    return Block.findOne({ where: { blockerId, blockedId } });
  },

  async createBlock(blockerId, blockedId) {
    return Block.create({ blockerId, blockedId });
  },

  async deleteBlock(blockerId, blockedId) {
    return Block.destroy({ where: { blockerId, blockedId } });
  },

  async listBlockedUsers(blockerId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Block.findAndCountAll({
      where: { blockerId },
      include: [
        {
          model: User,
          as: "blocked",
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      blocks: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },
};

export default blocksRepository;