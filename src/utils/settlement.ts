type BalanceMap = Map<string, number>;

type Settlement = {
  from: string;
  to: string;
  amount: number;
};

export const buildBalanceMap = (expenses: any[]): BalanceMap => {
  const balanceMap: BalanceMap = new Map();

  for (const expense of expenses) {
    const payerId = expense.paidById;
    const amount = Number(expense.amount);

    // ensure payer exists
    if (!balanceMap.has(payerId)) {
      balanceMap.set(payerId, 0);
    }

    // payer gets full amount
    balanceMap.set(payerId, balanceMap.get(payerId)! + amount);

    // subtract splits
    for (const split of expense.splits) {
      const userId = split.userId;
      const splitAmount = Number(split.amountOwed);

      if (!balanceMap.has(userId)) {
        balanceMap.set(userId, 0);
      }

      balanceMap.set(userId, balanceMap.get(userId)! - splitAmount);
    }
  }

  return balanceMap;
};

export const splitBalances = (balanceMap: BalanceMap) => {
  const creditors: { userId: string; amount: number }[] = [];
  const debtors: { userId: string; amount: number }[] = [];

  for (const [userId, balance] of balanceMap) {
    if (balance > 0) {
      creditors.push({ userId, amount: balance });
    } else if (balance < 0) {
      debtors.push({ userId, amount: -balance });
    }
  }

  return { creditors, debtors };
};

export const settleBalances = (
  creditors: { userId: string; amount: number }[],
  debtors: { userId: string; amount: number }[],
): Settlement[] => {
  const settlements: Settlement[] = [];

  // sort descending
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settleAmount = Math.min(debtor!.amount, creditor!.amount);

    settlements.push({
      from: debtor!.userId,
      to: creditor!.userId,
      amount: Number(settleAmount.toFixed(2)),
    });

    debtor!.amount -= settleAmount;
    creditor!.amount -= settleAmount;

    if (debtor!.amount === 0) i++;
    if (creditor!.amount === 0) j++;
  }

  return settlements;
};
