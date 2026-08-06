import blocksRepository from "../repositories/blocks.repository.js";
import ApiError from "../utils/apierror.js";

const blocksService = {
  async blockUser(blockerId, blockedId) {
    if (blockerId === blockedId) {
      throw new ApiError(400, "You cannot block yourself");
    }

    const targetUser = await blocksRepository.findUserById(blockedId);
    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }

    const existingBlock = await blocksRepository.findBlock(
      blockerId,
      blockedId,
    );
    if (existingBlock) {
      throw new ApiError(409, "You have already blocked this user");
    }

    return blocksRepository.createBlock(blockerId, blockedId);
  },

  async unblockUser(blockerId, blockedId) {
    const existingBlock = await blocksRepository.findBlock(
      blockerId,
      blockedId,
    );
    if (!existingBlock) {
      throw new ApiError(404, "You have not blocked this user");
    }

    await blocksRepository.deleteBlock(blockerId, blockedId);
  },

  async listBlockedUsers(blockerId, { page, limit } = {}) {
    return blocksRepository.listBlockedUsers(blockerId, { page, limit });
  },
};

export default blocksService;
