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
    // NOTE: blocking only prevents *sending* new DMs, per the spec.
    // Existing conversation history stays visible even after a block, since
    // the messages already happened before the block existed.
    return messagesRepository.getDirectMessages(userIdA, userIdB, {
      page,
      limit,
    });
  },
};

export default messagesService;