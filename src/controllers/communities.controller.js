import communitiesService from "../services/communities.service.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiresponse.js";
import ApiError from "../utils/apierror.js";

const communitiesController = {
  // GET /communities?state=Lagos&lga=Ikeja
  getByStateAndLga: asyncHandler(async (req, res) => {
    const { state, lga } = req.query;

    if (!state || !lga) {
      throw new ApiError(
        400,
        "Query parameters 'state' and 'lga' are required.",
      );
    }

    const community = await communitiesService.getByStateAndLga(state, lga);

    res
      .status(200)
      .json(new ApiResponse(200, community, "Community fetched successfully"));
  }),

  // GET /communities/:communityId
  getDetails: asyncHandler(async (req, res) => {
    const { communityId } = req.params;

    const community = await communitiesService.getDetails(communityId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          community,
          "Community details fetched successfully",
        ),
      );
  }),

  // GET /communities/:communityId/members?page=1&limit=20
  getMembers: asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await communitiesService.getMembers(communityId, {
      page,
      limit,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Community members fetched successfully"),
      );
  }),

  // POST /communities/:communityId/join
  join: asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const userId = req.user.id;

    const membership = await communitiesService.joinCommunity(
      communityId,
      userId,
    );

    res
      .status(201)
      .json(new ApiResponse(201, membership, "Joined community successfully"));
  }),

  // POST /communities/:communityId/leave
  leave: asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const userId = req.user.id;

    await communitiesService.leaveCommunity(communityId, userId);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Left community successfully"));
  }),
};

export default communitiesController;
