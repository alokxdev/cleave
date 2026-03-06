import { prisma } from "../../db/prisma.js";
import type { User } from "@prisma/client";
import { refreshTokenSchema } from "./auth.schema.js";

export const createUser = async (data: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}): Promise<User> => prisma.user.create({ data });

export const findUserByEmail = async (email: string): Promise<User | null> =>
  prisma.user.findUnique({ where: { email } });

export const findUserById = async (id: string): Promise<User | null> =>
  prisma.user.findUnique({ where: { id } });

export const saveRefreshToken = async (
  userId: string,
  refreshToken: string,
  expiresAt: Date,
) =>
  prisma.refreshToken.create({
    data: { userId, expiresAt, token: refreshToken },
  });

export const findRefreshToken = async (refreshToken: string) =>
  prisma.refreshToken.findUnique({ where: { token: refreshToken } });

export const revokeRefreshToken = async (token: string) =>
  prisma.refreshToken.delete({ where: { token } });
