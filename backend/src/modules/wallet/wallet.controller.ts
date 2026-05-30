import type { Request, Response, NextFunction } from "express";

import {
  getWalletBalanceService,
  getTransactionHistoryService,
  addFundsService,
} from "./wallet.service.js";

import type { AddFundsInput, TransactionQueryInput } from "./wallet.schema.js";

import { sendSuccess } from "../../lib/response.js";

/**
 * GET /api/wallet/balance
 */
export const getBalanceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;

    const result = await getWalletBalanceService(userId);

    return sendSuccess(res, "Wallet balance fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/wallet/transactions
 */
export const getTransactionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const { page, limit } = req.query as unknown as TransactionQueryInput;

    const result = await getTransactionHistoryService(userId, page, limit);

    return sendSuccess(
      res,
      "Transaction history fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/wallet/add-funds
 */
export const addFundsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const { amount, note } = req.body as AddFundsInput;

    const result = await addFundsService(userId, amount, note);

    return sendSuccess(res, "Funds added successfully", result);
  } catch (error) {
    next(error);
  }
};
