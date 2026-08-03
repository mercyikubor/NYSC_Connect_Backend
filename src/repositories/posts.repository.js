import models from "../models/index.js";

const { Post, Comment, Community, CommunityMember, User } = models;

const postsRepository = {
  async findCommunityById(communityId) {
    return Community.findByPk(communityId);
  },

  async isCommunityMember(communityId, userId) {
    const membership = await CommunityMember.findOne({
      where: { communityId, userId },
    });
    return Boolean(membership);
  },

  async createPost({ communityId, userId, content, media = [] }) {
    return Post.create({ communityId, userId, content, media });
  },

  async findPostById(postId) {
    return Post.findByPk(postId);
  },

  async findPostsByCommunity(communityId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Post.findAndCountAll({
      where: { communityId },
      include: [
        { model: User, as: "author", attributes: ["id", "fullName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      posts: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async createComment({ postId, userId, content }, options = {}) {
    return Comment.create({ postId, userId, content }, options);
  },

  async incrementCommentsCount(postId, options = {}) {
    return Post.increment("commentsCount", {
      by: 1,
      where: { id: postId },
      ...options,
    });
  },

  async findCommentsByPost(postId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Comment.findAndCountAll({
      where: { postId },
      include: [
        { model: User, as: "author", attributes: ["id", "fullName", "email"] },
      ],
      order: [["createdAt", "ASC"]],
      limit,
      offset,
    });

    return {
      comments: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },
};

export default postsRepository;