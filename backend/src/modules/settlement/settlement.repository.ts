import { prisma } from "../../db/prisma.js";
import type { Prisma } from "@prisma/client";

type TxClient = Prisma.TransactionClient;

// Record a settlement
export const createSettlement = async (
  data: {
    groupId: string;
    payerId: string;
    payeeId: string;
    amount: Prisma.Decimal;
  },
  tx?: TxClient,
) => {
  const client = tx ?? prisma;
  return client.settlement.create({ data });
};

// List settlements for a group
export const listGroupSettlements = async (groupId: string) =>
  prisma.settlement.findMany({
    where: { groupId },
    include: {
      payer: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      payee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

export const listUserSettlements = async (userId: string) =>
  prisma.settlement.findMany({
    where: {
      OR: [{ payerId: userId }, { payeeId: userId }],
    },
  });
