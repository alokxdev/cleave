import { Decimal } from "@prisma/client/runtime/library";
import { ApiError } from "../../utils/ApiError.js";
import {
  findWalletByUserId,
  listWalletTransactions,
  creditWallet,
  createWalletTransaction,
} from "./wallet.repository.js";

// Get wallet balance
export const getWalletBalanceService = async (userId: string) => {
  const wallet = await findWalletByUserId(userId);

  if (!wallet) {
    throw new ApiError(404, "Wallet not found");
  }

  return {
    balance: Number(wallet.balance),
    updatedAt: wallet.updatedAt,
  };
};

// Get transaction history (paginated)
export const getTransactionHistoryService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const wallet = await findWalletByUserId(userId);

  if (!wallet) {
    throw new ApiError(404, "Wallet not found");
  }

  return listWalletTransactions(userId, page, limit);
};

// Add test funds to wallet
export const addFundsService = async (
  userId: string,
  amount: number,
  note?: string,
) => {
  const wallet = await findWalletByUserId(userId);

  if (!wallet) {
    throw new ApiError(404, "Wallet not found");
  }

  const decimalAmount = new Decimal(amount);

  await creditWallet(userId, decimalAmount);

  await createWalletTransaction({
    userId,
    type: "INCOME",
    amount: decimalAmount,
    note: note ?? "Funds added",
  });

  const updatedWallet = await findWalletByUserId(userId);

  return {
    balance: Number(updatedWallet!.balance),
    amountAdded: amount,
  };
};
