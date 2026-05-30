import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, "Group name must be at least 2 characters")
    .max(100, "Group name cannot exceed 100 characters"),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

export const addMemberSchema = z.object({
  email: z.string().trim().pipe(z.email("Invalid email format")),
});

export type AddMemberFormData = z.infer<typeof addMemberSchema>;
