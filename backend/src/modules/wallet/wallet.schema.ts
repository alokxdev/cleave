import { z } from "zod";

export const addFundsSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than zero")
    .max(1000000, "Amount too large"),
  note: z.string().max(255).optional(),
});

export const transactionQuerySchema = z.object({
  page: z
    .string()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .default("20")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(100)),
});

export type AddFundsInput = z.infer<typeof addFundsSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
