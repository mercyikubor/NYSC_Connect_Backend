import blocksService from "../services/blocks.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const blocksController = {
  // POST /blocks/:userId
  blockUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const blockerId = req.user.id;

    const block = await blocksService.blockUser(blockerId, userId);

    res
      .status(201)
      .json(new ApiResponse(201, block, "User blocked successfully"));
  }),

  // DELETE /blocks/:userId
  unblockUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const blockerId = req.user.id;

    await blocksService.unblockUser(blockerId, userId);

    res
      .status(200)
      .json(new ApiResponse(200, null, "User unblocked successfully"));
  }),

  // GET /blocks?page=1&limit=20
  listBlockedUsers: asyncHandler(async (req, res) => {
    const blockerId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await blocksService.listBlockedUsers(blockerId, {
      page,
      limit,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Blocked users fetched successfully"));
  }),
};

export default blocksController;