import { apiClient } from "../../services/apiClient";
import type { ApiResponse } from "../auth/types";
import type {
  Group,
  GroupMember,
  CreateGroupInput,
  UpdateGroupInput,
  AddMemberInput,
  Settlement,
} from "./types";

export const getGroups = async () => {
  const res = await apiClient.get<ApiResponse<Group[]>>("/api/groups");
  return res.data.data;
};

export const createGroup = async (data: CreateGroupInput) => {
  const res = await apiClient.post<ApiResponse<Group>>("/api/groups", data);
  return res.data.data;
};

export const getGroup = async (groupId: string) => {
  const res = await apiClient.get<ApiResponse<Group>>(`/api/groups/${groupId}`);
  return res.data.data;
};

export const updateGroup = async (
  groupId: string,
  data: UpdateGroupInput,
) => {
  const res = await apiClient.patch<ApiResponse<Group>>(
    `/api/groups/${groupId}`,
    data,
  );
  return res.data.data;
};

export const deleteGroup = async (groupId: string) => {
  await apiClient.delete(`/api/groups/${groupId}`);
};

export const getGroupMembers = async (groupId: string) => {
  const res = await apiClient.get<ApiResponse<GroupMember[]>>(
    `/api/groups/${groupId}/members`,
  );
  return res.data.data;
};

export const addGroupMember = async (groupId: string, data: AddMemberInput) => {
  const res = await apiClient.post<ApiResponse<GroupMember>>(
    `/api/groups/${groupId}/members`,
    data,
  );
  return res.data.data;
};

export const removeGroupMember = async (groupId: string, userId: string) => {
  await apiClient.delete(`/api/groups/${groupId}/members/${userId}`);
};

export const getGroupBalances = async (groupId: string) => {
  const res = await apiClient.get<ApiResponse<Settlement[]>>(
    `/api/groups/${groupId}/balances`,
  );
  return res.data.data;
};
