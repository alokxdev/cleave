import { z } from "zod";

const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .max(10)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter");

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),

  firstName: z.string().trim().min(1, "First name is required").max(50),

  lastName: z.string().trim().min(1, "Last name is required").max(50),

  email: z
    .string()
    .trim()
    .max(255)
    .toLowerCase()
    .pipe(z.email("Invalid email address")),

  password: passwordSchema,
});

export const loginSchema = z.object({
  // username: z
  //   .string()
  //   .min(3, "Username must be at least 3 characters")
  //   .max(30)
  //   .regex(
  //     /^[a-zA-Z0-9_]+$/,
  //     "Username can only contain letters, numbers and underscores",
  //   ),
  email: z.string().trim().pipe(z.email("Invalid email address")),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
