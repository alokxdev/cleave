import { comparePassword, hashPassword } from "../../lib/hash.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt.js";
import { createUser, findUserByEmail } from "../user/user.repository.js";
import {
  findRefreshToken,
  revokeRefreshToken,
  saveRefreshToken,
} from "./auth.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { env } from "../../config/env.js";
import ms from "ms";

type RegisterInput = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async ({
  username,
  firstName,
  lastName,
  email,
  password,
}: RegisterInput) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "User already exists!");
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    username,
    firstName,
    lastName,
    email,
    passwordHash,
  });

  const { passwordHash: _, ...safeUser } = user;

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN));

  await saveRefreshToken(user.id, refreshToken, expiresAt);

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN));

  await saveRefreshToken(user.id, refreshToken, expiresAt);

  const { passwordHash: _, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

export const refreshUserToken = async (token: string) => {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, "Invalid Token");
  }
  const storedToken = await findRefreshToken(token);

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new ApiError(401, "Invalid Token");
  }

  await revokeRefreshToken(token);

  const accessToken = signAccessToken({ userId: payload.userId });
  const newRefreshToken = signRefreshToken({ userId: payload.userId });

  const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN));

  await saveRefreshToken(payload.userId, newRefreshToken, expiresAt);

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (token: string) => {
  const storedToken = await findRefreshToken(token);

  if (!storedToken) throw new ApiError(401, "Invalid Token");

  await revokeRefreshToken(token);
};
