import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import { settleUpSchema, settlementParamSchema } from "./settlement.schema.js";

import {
  settleUpController,
  getGroupSettlementsController,
} from "./settlement.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/:groupId/settle",
  validate({ params: settlementParamSchema, body: settleUpSchema }),
  settleUpController,
);

router.get(
  "/:groupId/history",
  validate({ params: settlementParamSchema }),
  getGroupSettlementsController,
);

export default router;
