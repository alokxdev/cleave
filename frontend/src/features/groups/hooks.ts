import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGroups,
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  addGroupMember,
  removeGroupMember,
  getGroupBalances,
} from "./api";
import type { AddMemberInput, UpdateGroupInput } from "./types";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useGroup = (groupId: string) => {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroup(groupId),
    enabled: !!groupId,
  });
};

export const useUpdateGroup = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGroupInput) => updateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useGroupMembers = (groupId: string) => {
  return useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: () => getGroupMembers(groupId),
    enabled: !!groupId,
  });
};

export const useAddGroupMember = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberInput) => addGroupMember(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupBalances", groupId] });
    },
  });
};

export const useRemoveGroupMember = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => removeGroupMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupBalances", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
    },
  });
};

export const useGroupBalances = (groupId: string) => {
  return useQuery({
    queryKey: ["groupBalances", groupId],
    queryFn: () => getGroupBalances(groupId),
    enabled: !!groupId,
  });
};
