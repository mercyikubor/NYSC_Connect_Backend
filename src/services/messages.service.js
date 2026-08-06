import messagesRepository from "../repositories/messages.repository.js";
import ApiError from "../utils/ApiError.js";

const messagesService = {
  async sendCommunityMessage({ communityId, senderId, content, attachments }) {
    const isMember = await messagesRepository.isCommunityMember(
      communityId,
      senderId
    );

    if (!isMember) {
      throw new ApiError(
        403,
        "Only community members can post messages here"
      );
    }

    return messagesRepository.createCommunityMessage({
      communityId,
      senderId,
      content,
      attachments,
    });
  },


  async sendDirectMessage({ senderId, receiverId, content, attachments }) {
    if (senderId === receiverId) {
      throw new ApiError(400, "You cannot send a message to yourself");
    }

    const blocked = await messagesRepository.isBlockedEitherWay(
      senderId,
      receiverId
    );

    if (blocked) {
      throw new ApiError(403, "You cannot message this user");
    }

    return messagesRepository.createDirectMessage({
      senderId,
      receiverId,
      content,
      attachments,
    });
  },


  async getCommunityMessages(communityId, { page, limit } = {}) {
    return messagesRepository.getCommunityMessages(communityId, {
      page,
      limit,
    });
  },


  async getDirectMessages(userIdA, userIdB, { page, limit } = {}) {
    return messagesRepository.getDirectMessages(userIdA, userIdB, {
      page,
      limit,
    });
  },


  // NEW: Get user's conversation list
  async getChats(userId, { page, limit } = {}) {
    return messagesRepository.getChats(userId, {
      page,
      limit,
    });
  },


  // NEW: Search conversations by username
  async searchChats(userId, search, { limit } = {}) {
    if (!search || search.trim().length === 0) {
      throw new ApiError(400, "Search term is required");
    }

    return messagesRepository.searchChats(
      userId,
      search.trim(),
      {
        limit,
      }
    );
  },


    // Search messages inside a direct conversation
  async searchMessages(
    userIdA,
    userIdB,
    search,
    { page, limit } = {}
  ) {
    if (!search || search.trim().length === 0) {
      throw new ApiError(400, "Search term is required");
    }

    return messagesRepository.searchMessages(
      userIdA,
      userIdB,
      search.trim(),
      {
        page,
        limit,
      }
    );
  },


  // Mark messages received from another user as read
  async markMessagesAsRead(senderId, receiverId) {
    if (senderId === receiverId) {
      throw new ApiError(
        400,
        "You cannot mark your own messages as read"
      );
    }

    return messagesRepository.markMessagesAsRead(
      senderId,
      receiverId
    );
  },
};

export default messagesService;