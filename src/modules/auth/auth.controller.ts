import type { Response, Request, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "./auth.service.js";
import { sendSuccess } from "../../lib/response.js";
import { error } from "node:console";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = registerUser(req.body);
    return sendSuccess(res, "User registered successfully", result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginUser(req.body);

    return sendSuccess(res, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshUserToken(refreshToken);

    return sendSuccess(res, "Token refreshed", result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;

    const result = await logoutUser(refreshToken);

    return sendSuccess(res, "Logout successful", result);
  } catch (error) {
    next(error);
  }
};
