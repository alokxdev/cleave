import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createGroupSchema,
  updateGroupSchema,
  addMemberSchema,
  groupParamSchema,
  memberParamSchema,
} from "./group.schema.js";

import {
  createGroupController,
  getUserGroupsController,
  getGroupController,
  updateGroupController,
  deleteGroupController,
  addMemberController,
  removeMemberController,
  listMembersController,
} from "./group.controller.js";
import { createExpenseBodySchema } from "../expenses/expense.schema.js";
import {
  createExpenseController,
  getGroupExpensesController,
} from "../expenses/expense.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate({ body: createGroupSchema }), createGroupController);

router.get("/", getUserGroupsController);

router.get(
  "/:groupId",
  validate({ params: groupParamSchema }),
  getGroupController,
);

router.patch(
  "/:groupId",
  validate({ params: groupParamSchema, body: updateGroupSchema }),
  updateGroupController,
);

router.delete(
  "/:groupId",
  validate({ params: groupParamSchema }),
  deleteGroupController,
);

router.post(
  "/:groupId/members",
  validate({ params: groupParamSchema, body: addMemberSchema }),
  addMemberController,
);

router.get(
  "/:groupId/members",
  validate({ params: groupParamSchema }),
  listMembersController,
);

router.post(
  "/:groupId/expenses",
  validate({
    params: groupParamSchema,
    body: createExpenseBodySchema,
  }),
  createExpenseController,
);

router.get(
  "/:groupId/expenses",
  validate({ params: groupParamSchema }),
  getGroupExpensesController,
);

router.delete(
  "/:groupId/members/:userId",
  validate({ params: memberParamSchema }),
  removeMemberController,
);

export default router;
