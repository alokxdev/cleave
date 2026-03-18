import { z } from "zod";

export const splitTypeEnum = z.enum(["EQUAL", "EXACT"]);

export const exactSplitSchema = z.object({
  userId: z.uuid("Invalid user id"),
  amount: z.number().positive("amount must be positive"),
});

export const createExpenseParamSchema = z.object({
  groupId: z.uuid("Invalid group id"),
});

const createExpenseBodySchemaUnrefined = z.object({
  description: z.string().min(1, "description required").max(255),
  amount: z.number().positive("amount must be greater than zero"),
  paidBy: z.uuid("invalid payer id"),
  splitType: splitTypeEnum,

  participants: z.array(z.uuid()).min(1).optional(),

  splits: z.array(exactSplitSchema).min(1).optional(),
});

export const createExpenseBodySchema = createExpenseBodySchemaUnrefined.refine(
  (data) => {
    if (data.splitType === "EQUAL") {
      return data.participants && !data.splits;
    }

    if (data.splitType === "EXACT") {
      return !data.participants && data.splits;
    }

    return false;
  },
  {
    message:
      "participants required for EQUAL split, splits required for EXACT split",
    path: ["splitType"],
  },
);

export const updateExpenseParamSchema = z.object({
  expenseId: z.uuid("Invalid expense id"),
});

export const updateExpenseBodySchema = z.object({
  description: z.string().min(1).max(255),
});

export const expenseParamSchema = z.object({
  expenseId: z.uuid("Inavalid expense id"),
});

export type CreateExpenseInput = z.infer<typeof createExpenseBodySchema>;

export type UpdateExpenseInput = z.infer<typeof updateExpenseBodySchema>;

export type ExactSplitInput = z.infer<typeof exactSplitSchema>;
