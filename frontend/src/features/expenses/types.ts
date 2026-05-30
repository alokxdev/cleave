export type ExpenseSplit = {
  id: string;
  expenseId: string;
  userId: string;
  amountOwed: string; // Decimal is returned as string from Prisma
};

export type ExpensePayer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Expense = {
  id: string;
  groupId: string;
  paidById: string;
  amount: string; // Decimal returned as string
  description: string | null;
  createdAt: string;
  updatedAt: string;
  splits: ExpenseSplit[];
  paidBy: ExpensePayer;
};

export type SplitType = "EQUAL" | "EXACT";

export type CreateExpenseInput = {
  description: string;
  amount: number;
  paidBy: string;
  splitType: SplitType;
  participants?: string[];
  splits?: {
    userId: string;
    amount: number;
  }[];
};

export type UpdateExpenseInput = {
  description: string;
};
