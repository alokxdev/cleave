import { Router } from "express";

import { validate } from "../../middleware/validate.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

import { updateUserSchema, deleteUserSchema } from "./user.schema.js";

import { getMe, updateMe, deleteMe } from "./user.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMe);
router.patch("/me", validate({ body: updateUserSchema }), updateMe);
router.delete("/me", validate({ body: deleteUserSchema }), deleteMe);

export default router;
