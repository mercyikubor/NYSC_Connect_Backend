import models from "../models/index.js";

const { Announcement, Community, CommunityMember, User } = models;

const announcementsRepository = {
  async findCommunityById(communityId) {
    return Community.findByPk(communityId);
  },

  async getCommunityMembership(communityId, userId) {
    return CommunityMember.findOne({ where: { communityId, userId } });
  },

  async getUserById(userId) {
    return User.findByPk(userId);
  },

  async create({ communityId, userId, title, content, pinned = false }) {
    return Announcement.create({
      communityId,
      userId,
      title,
      content,
      pinned,
    });
  },

  async findByCommunity(communityId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Announcement.findAndCountAll({
      where: { communityId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "fullName", "email"],
        },
      ],
      // Pinned announcements first, then newest first within each group
      order: [
        ["pinned", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });

    return {
      announcements: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },
};

export default announcementsRepository;