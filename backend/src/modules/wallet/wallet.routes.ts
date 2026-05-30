import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import { addFundsSchema, transactionQuerySchema } from "./wallet.schema.js";

import {
  getBalanceController,
  getTransactionsController,
  addFundsController,
} from "./wallet.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/balance", getBalanceController);

router.get(
  "/transactions",
  validate({ query: transactionQuerySchema }),
  getTransactionsController,
);

router.post(
  "/add-funds",
  validate({ body: addFundsSchema }),
  addFundsController,
);

export default router;
