import bcrypt from "bcrypt";
import { env } from "../config/env.js";

export const hashPassword = async (plain: string): Promise<string> => {
  try {
    return await bcrypt.hash(plain, env.BCRYPT_SALT_ROUNDS);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const comparePassword = async (
  plain: string,
  hashed: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plain, hashed);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
