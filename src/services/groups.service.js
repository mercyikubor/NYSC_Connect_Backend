import groupsRepository from "../repositories/groups.repository.js";
import { sequelize } from "../models/index.js";
import ApiError from "../utils/apierror.js";

const groupsService = {
  async createGroup({ communityId, name, description, createdBy }) {
    const community = await groupsRepository.findCommunityById(communityId);

    if (!community) {
      throw new ApiError(404, "Community not found");
    }

    const isMember = await groupsRepository.isCommunityMember(
      communityId,
      createdBy,
    );

    if (!isMember) {
      throw new ApiError(
        403,
        "You must be a member of this community to create a group in it",
      );
    }

    return sequelize.transaction(async (transaction) => {
      const group = await groupsRepository.create(
        { communityId, name, description, createdBy },
        { transaction },
      );

      // Creator automatically becomes the group's first member/admin
      await groupsRepository.createMembership(group.id, createdBy, "admin", {
        transaction,
      });

      await groupsRepository.incrementMembersCount(group.id, { transaction });

      return group;
    });
  },

  async getGroupsByCommunity(communityId, { page = 1, limit = 20 } = {}) {
    const community = await groupsRepository.findCommunityById(communityId);

    if (!community) {
      throw new ApiError(404, "Community not found");
    }

    return groupsRepository.findByCommunity(communityId, { page, limit });
  },

  async getDetails(groupId) {
    const group = await groupsRepository.findByIdWithDetails(groupId);

    if (!group) {
      throw new ApiError(404, "Group not found");
    }

    return group;
  },

  async getMembers(groupId, { page = 1, limit = 20 } = {}) {
    const group = await groupsRepository.findById(groupId);

    if (!group) {
      throw new ApiError(404, "Group not found");
    }

    return groupsRepository.getMembers(groupId, { page, limit });
  },

  async joinGroup(groupId, userId) {
    const group = await groupsRepository.findById(groupId);

    if (!group) {
      throw new ApiError(404, "Group not found");
    }

    // Groups are sub-communities - you must already belong to the parent
    // community before you can join one of its groups.
    const isCommunityMember = await groupsRepository.isCommunityMember(
      group.communityId,
      userId,
    );

    if (!isCommunityMember) {
      throw new ApiError(
        403,
        "You must be a member of the parent community to join this group",
      );
    }

    const existingMembership = await groupsRepository.getMembership(
      groupId,
      userId,
    );

    if (existingMembership) {
      throw new ApiError(409, "User is already a member of this group");
    }

    return sequelize.transaction(async (transaction) => {
      const membership = await groupsRepository.createMembership(
        groupId,
        userId,
        "member",
        { transaction },
      );

      await groupsRepository.incrementMembersCount(groupId, { transaction });

      return membership;
    });
  },

  async leaveGroup(groupId, userId) {
    const membership = await groupsRepository.getMembership(groupId, userId);

    if (!membership) {
      throw new ApiError(404, "User is not a member of this group");
    }

    // NOTE: same open question as Communities - this doesn't guard against
    // the group's last admin leaving. Add a check here if that matters.

    return sequelize.transaction(async (transaction) => {
      await groupsRepository.deleteMembership(groupId, userId, {
        transaction,
      });

      await groupsRepository.decrementMembersCount(groupId, { transaction });
    });
  },
};

export default groupsService;
