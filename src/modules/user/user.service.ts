import {
  deleteUser,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  updateUser,
} from "./user.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { comparePassword } from "../../lib/hash.js";

const sanitizeUser = (user: {
  passwordHash: string;
  [keys: string]: unknown;
}) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

// GET USER LOGIC

export const getCurrentUser = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
};

// UPDATE USER LOGIC

export const updateCurrentUser = async (
  userId: string,
  data: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  },
) => {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  if (data.username && existingUser.username != data.username) {
    const usernameTaken = await findUserByUsername(data.username);
    if (usernameTaken) {
      throw new ApiError(409, "Username already taken");
    }
  }

  if (data.email && existingUser.email != data.email) {
    const emailTaken = await findUserByEmail(data.email);
    if (emailTaken) {
      throw new ApiError(409, "Email already taken");
    }
  }

  const updatedUser = await updateUser(userId, data);

  return sanitizeUser(updatedUser);
};

// DELETE USER LOGIC

export const deleteCurrentUser = async (
  userId: string,
  data: { password: string },
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const passwordValid = comparePassword(data.password, user.passwordHash);

  if (!passwordValid) {
    throw new ApiError(401, "Invalid Password");
  }
  await deleteUser(userId);
};
