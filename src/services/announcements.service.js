import announcementsRepository from "../repositories/announcements.repository.js";
import ApiError from "../utils/apierror.js";

const announcementsService = {
  async createAnnouncement({ communityId, userId, title, content, pinned }) {
    const community =
      await announcementsRepository.findCommunityById(communityId);

    if (!community) {
      throw new ApiError(404, "Community not found");
    }

    // ASSUMPTION: "Admin and Community Leaders" means either:
    //   (a) a site-wide Admin (User.role === "Admin"), or
    //   (b) a community-level leader/admin (their CommunityMember.role
    //       for THIS specific community is "leader" or "admin").
    // A regular "member" of the community cannot post an announcement.
    const user = await announcementsRepository.getUserById(userId);

    const isSiteAdmin = user?.role === "Admin";

    const membership = await announcementsRepository.getCommunityMembership(
      communityId,
      userId,
    );
    const isCommunityLeaderOrAdmin =
      membership && ["leader", "admin"].includes(membership.role);

    if (!isSiteAdmin && !isCommunityLeaderOrAdmin) {
      throw new ApiError(
        403,
        "Only community leaders/admins or a site admin can post announcements",
      );
    }

    if (!title || !content) {
      throw new ApiError(400, "'title' and 'content' are required.");
    }

    return announcementsRepository.create({
      communityId,
      userId,
      title,
      content,
      pinned,
    });
  },

  async getCommunityAnnouncements(communityId, { page = 1, limit = 20 } = {}) {
    const community =
      await announcementsRepository.findCommunityById(communityId);

    if (!community) {
      throw new ApiError(404, "Community not found");
    }

    return announcementsRepository.findByCommunity(communityId, {
      page,
      limit,
    });
  },
};

export default announcementsService;
