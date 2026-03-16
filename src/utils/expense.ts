import { Decimal } from "@prisma/client/runtime/library";
import { ApiError } from "./ApiError.js";
import { listMembers } from "../modules/group/group.repository.js";
import type { ExactSplitInput } from "../modules/expenses/expense.schema.js";

export const validateParticipantsAreMemberOf = async (
  groupId: string,
  userIds: string[],
) => {
  const members = await listMembers(groupId);

  const memberIds = new Set(members.map((m) => m.userId));

  for (const userId in userIds) {
    if (!memberIds.has(userId)) {
      throw new ApiError(400, `User ${userId} is not a member of this group`);
    }
  }
};

// Calculate equal splits for a list of particiapants
export const CalculateEqualSplits = (
  amount: number,
  participants: string[],
) => {
  const share = new Decimal(amount).dividedBy(participants.length);

  return participants.map((userId) => ({
    userId,
    amountOwed: share,
  }));
};

// Validate that the exact split amounts sum to the total expense amount
export const validateExactSplits = (
  amount: number,
  splits: ExactSplitInput[],
) => {
  const total = splits.reduce(
    (sum, s) => sum.plus(new Decimal(s.amount)),
    new Decimal(0),
  );

  if (!total.equals(new Decimal(amount))) {
    throw new ApiError(
      400,
      "Exact split amounts must equal total expense amount",
    );
  }

  return splits.map((m) => ({
    userId: m.userId,
    amountOwed: new Decimal(m.amount),
  }));
};
