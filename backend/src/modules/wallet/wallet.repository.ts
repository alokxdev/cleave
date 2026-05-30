import { prisma } from "../../db/prisma.js";
import { Decimal } from "@prisma/client/runtime/library";
import type { Prisma, TransactionType } from "@prisma/client";

type TxClient = Prisma.TransactionClient;

// Create wallet with default balance
export const createWallet = async (userId: string, tx?: TxClient) => {
  const client = tx ?? prisma;
  return client.wallet.create({
    data: { userId },
  });
};

// Find wallet by user ID
export const findWalletByUserId = async (userId: string) =>
  prisma.wallet.findUnique({ where: { userId } });

// Credit wallet (add funds)
export const creditWallet = async (
  userId: string,
  amount: Decimal,
  tx?: TxClient,
) => {
  const client = tx ?? prisma;
  return client.wallet.update({
    where: { userId },
    data: { balance: { increment: amount } },
  });
};

// Debit wallet (subtract funds) — caller must verify sufficient balance
export const debitWallet = async (
  userId: string,
  amount: Decimal,
  tx?: TxClient,
) => {
  const client = tx ?? prisma;
  return client.wallet.update({
    where: { userId },
    data: { balance: { decrement: amount } },
  });
};

// Record a wallet transaction
export const createWalletTransaction = async (
  data: {
    userId: string;
    type: TransactionType;
    amount: Decimal;
    note?: string;
  },
  tx?: TxClient,
) => {
  const client = tx ?? prisma;
  return client.walletTransaction.create({ data });
};

// List wallet transactions with pagination
export const listWalletTransactions = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.walletTransaction.count({ where: { userId } }),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
