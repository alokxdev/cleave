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
    .max(100, "Group name cannot exceed 100 characters"),
});

export const addMemberSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email format")),
});

export const groupParamSchema = z.object({
  groupId: z.uuid("Invalid group ID"),
});

export const memberParamSchema = z.object({
  groupId: z.uuid("Invalid group ID"),
  userId: z.uuid("Invalid user ID"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
