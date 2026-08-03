import communitiesRepository from "../repositories/communities.repository.js";
import { sequelize } from "../models/index.js";
import ApiError from "../utils/ApiError.js";

const communitiesService = {
  async getByStateAndLga(state, lga) {
    const community = await communitiesRepository.findByStateAndLga(
      state,
      lga
    );

    if (!community) {
      throw new ApiError(404, `No community found for ${lga}, ${state}`);
    }

    return community;
  },

  async getDetails(communityId) {
    const community = await communitiesRepository.findByIdWithDetails(
      communityId
    );

    if (!community) {
      throw new ApiError(404, "Community not found");
    }

    return community;
  },

  async getMembers(communityId, { page = 1, limit = 20 } = {}) {
    const community = await communitiesRepository.findById(communityId);

    if (!community) {
      throw new ApiError(404, "Community not found");
    }

    return communitiesRepository.getMembers(communityId, { page, limit });
  },

  async joinCommunity(communityId, userId) {
    const community = await communitiesRepository.findById(communityId);

    if (!community) {
      throw new ApiError(404, "Community not found");
    }

    const existingMembership = await communitiesRepository.getMembership(
      communityId,
      userId
    );

    if (existingMembership) {
      throw new ApiError(409, "User is already a member of this community");
    }

    return sequelize.transaction(async (transaction) => {
      const membership = await communitiesRepository.createMembership(
        communityId,
        userId,
        "member",
        { transaction }
      );

      await communitiesRepository.incrementMembersCount(communityId, {
        transaction,
      });

      return membership;
    });
  },

  async leaveCommunity(communityId, userId) {
    const membership = await communitiesRepository.getMembership(
      communityId,
      userId
    );

    if (!membership) {
      throw new ApiError(404, "User is not a member of this community");
    }

    return sequelize.transaction(async (transaction) => {
      await communitiesRepository.deleteMembership(communityId, userId, {
        transaction,
      });

      await communitiesRepository.decrementMembersCount(communityId, {
        transaction,
      });
    });
  },
};

export default communitiesService;