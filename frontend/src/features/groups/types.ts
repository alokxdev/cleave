import type { User } from "../auth/types";

export type Group = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type GroupMemberRole = "OWNER" | "MEMBER";

export type GroupMember = {
  id: string;
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  joinedAt: string;
  user: User;
};

export type GroupWithMembers = Group & {
  members: GroupMember[];
};

export type CreateGroupInput = {
  name: string;
};

export type UpdateGroupInput = {
  name: string;
};

export type AddMemberInput = {
  email: string;
};

export type Settlement = {
  from: string;
  to: string;
  amount: number;
};
