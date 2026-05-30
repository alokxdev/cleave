import { z } from "zod";

export const createExpenseFormSchema = z.object({
  description: z.string().min(1, "Description is required").max(255),
  amount: z.number().positive("Amount must be greater than zero"),
  paidBy: z.string().min(1, "Payer is required"),
  splitType: z.enum(["EQUAL", "EXACT"]),
  participants: z.array(z.string()).min(1, "At least one participant is required").optional(),
});

export type CreateExpenseFormData = z.infer<typeof createExpenseFormSchema>;
