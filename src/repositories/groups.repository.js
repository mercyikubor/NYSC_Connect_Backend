import models from "../models/index.js";

const { Group, GroupMember, CommunityMember, Community, User } = models;

const groupsRepository = {
  async isCommunityMember(communityId, userId) {
    const membership = await CommunityMember.findOne({
      where: { communityId, userId },
    });
    return Boolean(membership);
  },

  async findCommunityById(communityId) {
    return Community.findByPk(communityId);
  },

  async create({ communityId, name, description, createdBy }, options = {}) {
    return Group.create(
      { communityId, name, description, createdBy },
      options
    );
  },

  async findById(groupId) {
    return Group.findByPk(groupId);
  },

  async findByIdWithDetails(groupId) {
    return Group.findByPk(groupId, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });
  },

  async findByCommunity(communityId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Group.findAndCountAll({
      where: { communityId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      groups: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getMembers(groupId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await GroupMember.findAndCountAll({
      where: { groupId },
      include: [
        { model: User, as: "user", attributes: ["id", "fullName", "email"] },
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

  async getMembership(groupId, userId) {
    return GroupMember.findOne({ where: { groupId, userId } });
  },

  async createMembership(groupId, userId, role = "member", options = {}) {
    return GroupMember.create({ groupId, userId, role }, options);
  },

  async deleteMembership(groupId, userId, options = {}) {
    return GroupMember.destroy({ where: { groupId, userId }, ...options });
  },

  async incrementMembersCount(groupId, options = {}) {
    return Group.increment("membersCount", {
      by: 1,
      where: { id: groupId },
      ...options,
    });
  },

  async decrementMembersCount(groupId, options = {}) {
    return Group.decrement("membersCount", {
      by: 1,
      where: { id: groupId },
      ...options,
    });
  },
};

export default groupsRepository;