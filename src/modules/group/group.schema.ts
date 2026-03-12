import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, "Group name must be atlest 2 characters")
    .max(100, "Group name cannot exceed 100 characters"),
});

export const updateGroupSchema = z.object({
  name: z
    .string()
    .min(2, "Group name must be at least 2 characters")
    .max(100, "Group name cannot exceed 100 characters")
    .optional(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type updateGroupInput = z.infer<typeof updateGroupSchema>;
