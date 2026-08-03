import groupsService from "../services/groups.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const groupsController = {
  // POST /groups
  // body: { communityId, name, description }
  createGroup: asyncHandler(async (req, res) => {
    const { communityId, name, description } = req.body;
    const createdBy = req.user.id;

    if (!communityId || !name) {
      throw new ApiError(400, "'communityId' and 'name' are required.");
    }

    const group = await groupsService.createGroup({
      communityId,
      name,
      description,
      createdBy,
    });

    res
      .status(201)
      .json(new ApiResponse(201, group, "Group created successfully"));
  }),

  // GET /groups/community/:communityId?page=1&limit=20
  getGroupsByCommunity: asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await groupsService.getGroupsByCommunity(communityId, {
      page,
      limit,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Groups fetched successfully"));
  }),

  // GET /groups/:groupId
  getDetails: asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const group = await groupsService.getDetails(groupId);

    res
      .status(200)
      .json(new ApiResponse(200, group, "Group details fetched successfully"));
  }),

  // GET /groups/:groupId/members?page=1&limit=20
  getMembers: asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await groupsService.getMembers(groupId, { page, limit });

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Group members fetched successfully")
      );
  }),

  // POST /groups/:groupId/join
  join: asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    const membership = await groupsService.joinGroup(groupId, userId);

    res
      .status(201)
      .json(new ApiResponse(201, membership, "Joined group successfully"));
  }),

  // POST /groups/:groupId/leave
  leave: asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    await groupsService.leaveGroup(groupId, userId);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Left group successfully"));
  }),
};

export default groupsController;