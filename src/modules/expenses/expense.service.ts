import { Decimal } from "@prisma/client/runtime/library";
import {
  validateExactSplits,
  validateParticipantsAreMemberOf,
  CalculateEqualSplits,
} from "../../utils/expense.js";
import { requireGroupMember } from "../../utils/groupAuth.js";
import type { CreateExpenseInput } from "./expense.schema.js";
import { prisma } from "../../db/prisma.js";

// CREATE EXPENSE maa chua lo apni apni

export const createExpenseService = async (
  groupId: string,
  currentUserId: string,
  data: CreateExpenseInput,
) => {
  await requireGroupMember(groupId, currentUserId);

  await requireGroupMember(groupId, data.paidBy);

  let splits: { userId: string; amountOwed: Decimal }[];

  if (data.splitType === "EQUAL") {
    await validateParticipantsAreMemberOf(groupId, data.participants!);

    splits = CalculateEqualSplits(data.amount, data.participants!);
  } else {
    await validateParticipantsAreMemberOf(
      groupId,
      data.splits!.map((m) => m.userId),
    );

    splits = validateExactSplits(data.amount, data.splits!);
  }

  return prisma.$transaction(async (tx) => {
    const expense = await tx.expense.create({
      data: {
        groupId,
        paidById: data.paidBy,
        amount: new Decimal(data.amount),
        description: data.description,
      },
    });

    await tx.expenseSplit.createMany({
      data: splits.map((s) => ({
        expenseId: expense.id,
        userId: s.userId,
        amountOwed: s.amountOwed,
      })),
    });

    return expense;
  });
};
