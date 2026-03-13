import { GroupMemberRole } from "@prisma/client";
import { prisma } from "../../db/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

import {
  requireGroupMember,
  requireGroupOwner,
} from "../../utils/groupAuth.js";

import { findUserByEmail } from "../user/user.repository.js";

import type {
  CreateGroupInput,
  UpdateGroupInput,
  AddMemberInput,
} from "./group.schema.js";

import {
  findGroupById,
  findUserGroups,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  findMember,
  listMembers,
} from "./group.repository.js";

export const createGroupService = async (
  userId: string,
  data: CreateGroupInput,
) =>
  prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: { name: data.name, createdBy: userId },
    });
    await tx.groupMember.create({
      data: { groupId: group.id, userId, role: GroupMemberRole.OWNER },
    });
    return group;
  });

export const getUserGroupsService = async (userId: string) => {
  return findUserGroups(userId);
};

export const getGroupService = async (groupId: string, userId: string) => {
  await requireGroupMember(groupId, userId);

  const group = await findGroupById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  return group;
};

export const updateGroupService = async (
  groupId: string,
  userId: string,
  data: UpdateGroupInput,
) => {
  await requireGroupOwner(groupId, userId);

  return updateGroup(groupId, data);
};

export const deleteGroupService = async (groupId: string, userId: string) => {
  await requireGroupOwner(groupId, userId);

  return deleteGroup(groupId);
};

export const addMemberService = async (
  groupId: string,
  userId: string,
  data: AddMemberInput,
) => {
  await requireGroupOwner(groupId, userId);
  const user = await findUserByEmail(data.email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existing = await findMember(groupId, user.id);

  if (existing) {
    throw new ApiError(400, "User already a member");
  }

  return addMember(groupId, user.id, GroupMemberRole.MEMBER);
};

export const removeMemberService = async (
  groupId: string,
  currentUserId: string,
  targetUserId: string,
) => {
  const membership = await requireGroupMember(groupId, currentUserId);

  if (
    membership.role !== GroupMemberRole.OWNER &&
    currentUserId !== targetUserId
  ) {
    throw new ApiError(403, "Not allowed to remove this member");
  }

  return removeMember(groupId, targetUserId);
};

export const listMembersService = async (groupId: string, userId: string) => {
  await requireGroupMember(groupId, userId);

  return listMembers(groupId);
};
