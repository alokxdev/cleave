import { prisma } from "../../db/prisma.js";

import type { User } from "@prisma/client";
import type { UpdateUserInput } from "./user.schema.js";
// import type { UpdateUserInput } from "./user.schema.js";

export const createUser = async (data: User): Promise<User> =>
  prisma.user.create({ data });

export const findUserByEmail = async (email: string): Promise<User | null> =>
  prisma.user.findUnique({ where: { email } });

export const findUserById = async (id: string): Promise<User | null> =>
  prisma.user.findUnique({ where: { id } });

export const findUserByUsername = async (username: string) =>
  prisma.user.findUnique({ where: { username } });

export const updateUser = async (
  id: string,
  data: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  },
): Promise<User> => prisma.user.update({ where: { id }, data });

export const deleteUser = async (id: string): Promise<User> =>
  prisma.user.delete({
    where: { id },
  });
