import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Invalid email address")),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().pipe(z.email("Invalid email address")),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(10, "Password must be at most 10 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
