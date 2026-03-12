import { ApiError } from "./ApiError.js";
import { prisma } from "../db/prisma.js";
import { GroupMemberRole, type GroupMember } from "@prisma/client";

export const requireGroupMember = async (
  groupId: string,
  userId: string,
): Promise<GroupMember> => {
  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!membership) {
    throw new ApiError(403, "User is not a member of this group");
  }

  return membership!;
};

export const requireGroupOwner = async (groupId: string, userId: string) => {
  const membership = await requireGroupMember(groupId, userId);
  if (membership.role !== GroupMemberRole.OWNER) {
    throw new ApiError(403, "Only group owner can perform this action");
  }

  return membership;
};
