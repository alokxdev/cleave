import type { Request, Response, NextFunction } from "express";

import {
  getGroupBalancesService,
  getUserBalancesService,
  settleUpService,
  getGroupSettlementsService,
} from "./settlement.service.js";

import type { SettleUpInput } from "./settlement.schema.js";

import { sendSuccess } from "../../lib/response.js";

export const getGroupBalancesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const { groupId } = req.params as { groupId: string };

    const balances = await getGroupBalancesService(groupId, userId);

    sendSuccess(res, "Group balances fetched successfully", balances);
  } catch (error) {
    next(error);
  }
};

export const getUserBalancesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;

    const result = await getUserBalancesService(userId);

    sendSuccess(res, "User balances fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/settlements/:groupId/settle
 */
export const settleUpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payerId = req.user!.userId;
    const { groupId } = req.params as { groupId: string };
    const { payeeId, amount } = req.body as SettleUpInput;

    const settlement = await settleUpService(groupId, payerId, payeeId, amount);

    sendSuccess(res, "Settlement completed successfully", settlement, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/settlements/:groupId/history
 */
export const getGroupSettlementsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const { groupId } = req.params as { groupId: string };

    const settlements = await getGroupSettlementsService(groupId, userId);

    sendSuccess(
      res,
      "Settlement history fetched successfully",
      settlements,
    );
  } catch (error) {
    next(error);
  }
};
