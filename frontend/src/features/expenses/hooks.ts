import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGroupExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./api";
import type { CreateExpenseInput, UpdateExpenseInput } from "./types";

export const useGroupExpenses = (groupId: string) => {
  return useQuery({
    queryKey: ["groupExpenses", groupId],
    queryFn: () => getGroupExpenses(groupId),
    enabled: !!groupId,
  });
};

export const useCreateExpense = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseInput) => createExpense(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupBalances", groupId] });
    },
  });
};

export const useUpdateExpense = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      data,
    }: {
      expenseId: string;
      data: UpdateExpenseInput;
    }) => updateExpense(expenseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupBalances", groupId] });
    },
  });
};

export const useDeleteExpense = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupBalances", groupId] });
    },
  });
};
