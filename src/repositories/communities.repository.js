import models from "../models/index.js";

const { Community, CommunityMember, User } = models;

const communitiesRepository = {
  async findByStateAndLga(state, lga) {
    return Community.findOne({ where: { state, lga } });
  },

  async findById(communityId) {
    return Community.findByPk(communityId);
  },

  async findByIdWithDetails(communityId) {
    return Community.findByPk(communityId, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });
  },

  async getMembers(communityId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await CommunityMember.findAndCountAll({
      where: { communityId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [["joinedAt", "ASC"]],
      limit,
      offset,
    });

    return {
      members: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getMembership(communityId, userId) {
    return CommunityMember.findOne({ where: { communityId, userId } });
  },

  async createMembership(communityId, userId, role = "member", options = {}) {
    return CommunityMember.create({ communityId, userId, role }, options);
  },

  async deleteMembership(communityId, userId, options = {}) {
    return CommunityMember.destroy({
      where: { communityId, userId },
      ...options,
    });
  },

  async incrementMembersCount(communityId, options = {}) {
    return Community.increment("membersCount", {
      by: 1,
      where: { id: communityId },
      ...options,
    });
  },

  async decrementMembersCount(communityId, options = {}) {
    return Community.decrement("membersCount", {
      by: 1,
      where: { id: communityId },
      ...options,
    });
  },
};

export default communitiesRepository;