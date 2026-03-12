import { prisma } from "../../db/prisma.js";
import type { User, Prisma } from "@prisma/client";

// interface UpdateUserInput {
//   username?: string;
//   firstName?: string;
//   lastName?: string;
//   email?: string;
// }

export const createUser = async (data: Prisma.UserCreateInput): Promise<User> =>
  prisma.user.create({ data });

export const findUserByEmail = async (email: string): Promise<User | null> =>
  prisma.user.findUnique({ where: { email } });

export const findUserById = async (id: string): Promise<User | null> =>
  prisma.user.findUnique({ where: { id } });

export const findUserByUsername = async (username: string) =>
  prisma.user.findUnique({ where: { username } });

export const updateUser = async (
  id: string,
  data: Prisma.UserUpdateInput,
): Promise<User> => prisma.user.update({ where: { id }, data });

export const deleteUser = async (id: string): Promise<User> =>
  prisma.user.delete({
    where: { id },
  });
