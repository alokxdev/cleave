import { prisma } from "../../db/prisma.js";

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
