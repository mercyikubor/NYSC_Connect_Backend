import postsService from "../services/posts.service.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiresponse.js";
import ApiError from "../utils/apierror.js";

const postsController = {
  // POST /posts
  // body: { communityId, content, media }
  createPost: asyncHandler(async (req, res) => {
    const { communityId, content, media } = req.body || {};
    const userId = req.user.id;

    if (!communityId) {
      throw new ApiError(400, "'communityId' is required.");
    }

    const post = await postsService.createPost({
      communityId,
      userId,
      content,
      media,
    });

    res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  }),

  // GET /posts/community/:communityId?page=1&limit=20
  getCommunityPosts: asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await postsService.getCommunityPosts(communityId, {
      page,
      limit,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Community posts fetched successfully"),
      );
  }),

  // POST /posts/:postId/comments
  // body: { content }
  createComment: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body || {};
    const userId = req.user.id;

    const comment = await postsService.createComment({
      postId,
      userId,
      content,
    });

    res
      .status(201)
      .json(new ApiResponse(201, comment, "Comment added successfully"));
  }),

  // GET /posts/:postId/comments?page=1&limit=20
  getPostComments: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await postsService.getPostComments(postId, {
      page,
      limit,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Comments fetched successfully"));
  }),
};

export default postsController;
