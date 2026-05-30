import { z } from "zod";

export const settleUpSchema = z.object({
  payeeId: z.uuid("Invalid payee ID"),
  amount: z
    .number()
    .positive("Amount must be greater than zero")
    .max(10000000, "Amount too large"),
});

export const settlementParamSchema = z.object({
  groupId: z.uuid("Invalid group ID"),
});

export type SettleUpInput = z.infer<typeof settleUpSchema>;
