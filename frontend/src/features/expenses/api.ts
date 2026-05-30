import { apiClient } from "../../services/apiClient";
import type { ApiResponse } from "../auth/types";
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from "./types";

export const getGroupExpenses = async (groupId: string) => {
  const res = await apiClient.get<ApiResponse<Expense[]>>(
    `/api/groups/${groupId}/expenses`,
  );
  return res.data.data;
};

export const createExpense = async (
  groupId: string,
  data: CreateExpenseInput,
) => {
  const res = await apiClient.post<ApiResponse<Expense>>(
    `/api/groups/${groupId}/expenses`,
    data,
  );
  return res.data.data;
};

export const updateExpense = async (
  expenseId: string,
  data: UpdateExpenseInput,
) => {
  const res = await apiClient.patch<ApiResponse<Expense>>(
    `/api/expense/${expenseId}`,
    data,
  );
  return res.data.data;
};

export const deleteExpense = async (expenseId: string) => {
  await apiClient.delete(`/api/expense/${expenseId}`);
};
