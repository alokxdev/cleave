import type { Request, Response, NextFunction } from "express";

import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
} from "./user.service.js";

import type { UpdateUserInput, DeleteUserInput } from "./user.schema.js";

import { sendSuccess } from "../../lib/response.js";

/**
 * GET /api/users/me
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;

    const user = await getCurrentUser(userId);

    return sendSuccess(res, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/me
 */
export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;

    const updatedUser = await updateCurrentUser(
      userId,
      req.body as UpdateUserInput,
    );

    return sendSuccess(res, "User updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/me
 */
export const deleteMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;

    await deleteCurrentUser(userId, req.body as DeleteUserInput);

    return sendSuccess(res, "User account deleted", undefined, 204);
  } catch (error) {
    next(error);
  }
};
