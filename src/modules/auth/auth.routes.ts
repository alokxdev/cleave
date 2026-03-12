import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "./auth.schema.js";
import { register, login, refreshToken, logout } from "./auth.controller.js";

const router = Router();

router.post("/register", validate({ body: registerSchema }), register);
router.post("/login", validate({ body: loginSchema }), login);
router.post("/refresh", validate({ body: refreshTokenSchema }), refreshToken);
router.post("/logout", validate({ body: refreshTokenSchema }), logout);

export default router;
