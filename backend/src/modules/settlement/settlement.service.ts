import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../db/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { requireGroupMember } from "../../utils/groupAuth.js";
import {
  applySettlementsToBalanceMap,
  buildBalanceMap,
  settleBalances,
  splitBalances,
} from "../../utils/settlement.js";
import {
  findUserExpense,
  listGroupExpenses,
} from "../expenses/expense.repository.js";
import {
  createSettlement,
  listGroupSettlements,
  listUserSettlements,
} from "./settlement.repository.js";
import {
  findWalletByUserId,
} from "../wallet/wallet.repository.js";

// Get calculated balances for a group (who owes whom)
export const getGroupBalancesService = async (
  groupId: string,
  userId: string,
) => {
  await requireGroupMember(groupId, userId);

  const [expenses, existingSettlements] = await Promise.all([
    listGroupExpenses(groupId),
    listGroupSettlements(groupId),
  ]);

  const balanceMap = buildBalanceMap(expenses);
  applySettlementsToBalanceMap(balanceMap, existingSettlements);
  const { creditors, debtors } = splitBalances(balanceMap);
  const settlements = settleBalances(creditors, debtors);

  return settlements;
};

// Get user's overall net balance across all groups
export const getUserBalancesService = async (userId: string) => {
  const [expenses, existingSettlements] = await Promise.all([
    findUserExpense(userId),
    listUserSettlements(userId),
  ]);

  if (!expenses.length && !existingSettlements.length) {
    return {
      netBalance: 0,
    };
  }

  const balanceMap = buildBalanceMap(expenses);
  applySettlementsToBalanceMap(balanceMap, existingSettlements);

  return {
    netBalance: Number((balanceMap.get(userId) || 0).toFixed(2)),
  };
};

// Actually settle a debt: transfer funds from payer to payee
export const settleUpService = async (
  groupId: string,
  payerId: string,
  payeeId: string,
  amount: number,
) => {
  // Verify both users are group members
  await requireGroupMember(groupId, payerId);
  await requireGroupMember(groupId, payeeId);

  if (payerId === payeeId) {
    throw new ApiError(400, "Cannot settle with yourself");
  }

  const decimalAmount = new Decimal(amount);

  // Verify payer has sufficient balance
  const payerWallet = await findWalletByUserId(payerId);
  if (!payerWallet) {
    throw new ApiError(404, "Payer wallet not found");
  }

  if (payerWallet.balance.lessThan(decimalAmount)) {
    throw new ApiError(400, "Insufficient wallet balance");
  }

  const payeeWallet = await findWalletByUserId(payeeId);
  if (!payeeWallet) {
    throw new ApiError(404, "Payee wallet not found");
  }

  const [expenses, existingSettlements] = await Promise.all([
    listGroupExpenses(groupId),
    listGroupSettlements(groupId),
  ]);
  const balanceMap = buildBalanceMap(expenses);
  applySettlementsToBalanceMap(balanceMap, existingSettlements);
  const { creditors, debtors } = splitBalances(balanceMap);
  const currentSettlements = settleBalances(creditors, debtors);
  const currentDebt = currentSettlements.find(
    (settlement) => settlement.from === payerId && settlement.to === payeeId,
  );

  if (!currentDebt || currentDebt.amount + 0.001 < amount) {
    throw new ApiError(400, "Settlement amount exceeds current debt");
  }

  // Execute everything in a transaction for atomicity
  const settlement = await prisma.$transaction(async (tx) => {
    // Debit payer's wallet
    await tx.wallet.update({
      where: { userId: payerId },
      data: { balance: { decrement: decimalAmount } },
    });

    // Credit payee's wallet
    await tx.wallet.update({
      where: { userId: payeeId },
      data: { balance: { increment: decimalAmount } },
    });

    // Record wallet transactions for both parties
    await tx.walletTransaction.createMany({
      data: [
        {
          userId: payerId,
          type: "EXPENSE",
          amount: decimalAmount,
          note: `Settlement payment to group`,
        },
        {
          userId: payeeId,
          type: "INCOME",
          amount: decimalAmount,
          note: `Settlement received from group`,
        },
      ],
    });

    // Create settlement record
    const record = await createSettlement(
      {
        groupId,
        payerId,
        payeeId,
        amount: decimalAmount,
      },
      tx,
    );

    return record;
  });

  return settlement;
};

// Get settlement history for a group
export const getGroupSettlementsService = async (
  groupId: string,
  userId: string,
) => {
  await requireGroupMember(groupId, userId);

  return listGroupSettlements(groupId);
};
