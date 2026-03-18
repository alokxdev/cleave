import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import { groupParamSchema } from "../group/group.schema.js";
import {
  createExpenseParamSchema,
  createExpenseBodySchema,
  updateExpenseParamSchema,
  updateExpenseBodySchema,
  expenseParamSchema,
} from "./expense.schema.js";

import {
  createExpenseController,
  getGroupExpensesController,
  getExpenseController,
  updateExpenseController,
  deleteExpenseController,
} from "./expense.controller.js";

const router = Router();

router.use(authMiddleware);

// Group Expenses
router.post(
  "/groups/:groupId/expenses",
  validate({
    params: createExpenseParamSchema,
    body: createExpenseBodySchema,
  }),
  createExpenseController,
);

router.get(
  "/groups/:groupId/expenses",
  validate({ params: groupParamSchema }),
  getGroupExpensesController,
);

// Single Expense
router.get(
  "/expenses/:expenseId",
  validate({ params: expenseParamSchema }),
  getExpenseController,
);

router.patch(
  "/expenses/:expenseId",
  validate({
    params: updateExpenseParamSchema,
    body: updateExpenseBodySchema,
  }),
  updateExpenseController,
);

router.delete(
  "/expenses/:expenseId",
  validate({ params: expenseParamSchema }),
  deleteExpenseController,
);

export default router;
