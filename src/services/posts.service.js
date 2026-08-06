import postsRepository from "../repositories/posts.repository.js";
import { sequelize } from "../models/index.js";
import ApiError from "../utils/apierror.js";

const postsService = {
  async createPost({ communityId, userId, content, media }) {
    const community = await postsRepository.findCommunityById(communityId);
    if (!community) {
      throw new ApiError(404, "Community not found");
    }

    const isMember = await postsRepository.isCommunityMember(
      communityId,
      userId,
    );
    if (!isMember) {
      throw new ApiError(403, "Only community members can post here");
    }

    if (!content) {
      throw new ApiError(400, "'content' is required.");
    }

    return postsRepository.createPost({ communityId, userId, content, media });
  },

  async getCommunityPosts(communityId, { page = 1, limit = 20 } = {}) {
    const community = await postsRepository.findCommunityById(communityId);
    if (!community) {
      throw new ApiError(404, "Community not found");
    }

    return postsRepository.findPostsByCommunity(communityId, { page, limit });
  },

  async createComment({ postId, userId, content }) {
    const post = await postsRepository.findPostById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const isMember = await postsRepository.isCommunityMember(
      post.communityId,
      userId,
    );
    if (!isMember) {
      throw new ApiError(
        403,
        "Only members of this post's community can comment",
      );
    }

    if (!content) {
      throw new ApiError(400, "'content' is required.");
    }

    return sequelize.transaction(async (transaction) => {
      const comment = await postsRepository.createComment(
        { postId, userId, content },
        { transaction },
      );

      await postsRepository.incrementCommentsCount(postId, { transaction });

      return comment;
    });
  },

  async getPostComments(postId, { page = 1, limit = 20 } = {}) {
    const post = await postsRepository.findPostById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    return postsRepository.findCommentsByPost(postId, { page, limit });
  },
};

export default postsService;
