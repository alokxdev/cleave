import { z } from "zod";

const updateUserSchemaUnrefined = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+&/,
      "Username can only contain letters, numbers and underscores",
    )
    .optional(),

  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50)
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50)
    .optional(),

  email: z.string().trim().max(255).toLowerCase().pipe(z.email()).optional(),
});

export const updateUserSchema = updateUserSchemaUnrefined.refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided for update",
  },
);
export const deleteUserSchema = z.object({
  password: z
    .string()
    .min(1, "password is required to confirm account deletion"),
});

export type UpdateUserInput = z.infer<typeof updateUserSchemaUnrefined>;
export type DeleteUserInput = z.input<typeof deleteUserSchema>;
