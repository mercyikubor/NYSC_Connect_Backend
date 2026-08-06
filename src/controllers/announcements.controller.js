import announcementsService from "../services/announcements.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const announcementsController = {
  // POST /announcements
  // body: { communityId, title, content, pinned }
  createAnnouncement: asyncHandler(async (req, res) => {
    const { communityId, title, content, pinned } = req.body || {};
    const userId = req.user.id;

    if (!communityId) {
      throw new ApiError(400, "'communityId' is required.");
    }

    const announcement = await announcementsService.createAnnouncement({
      communityId,
      userId,
      title,
      content,
      pinned,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, announcement, "Announcement created successfully")
      );
  }),

  // GET /announcements/community/:communityId?page=1&limit=20
  getCommunityAnnouncements: asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await announcementsService.getCommunityAnnouncements(
      communityId,
      { page, limit }
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Announcements fetched successfully")
      );
  }),
};

export default announcementsController;