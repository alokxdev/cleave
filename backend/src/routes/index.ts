import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import groupRoutes from "../modules/group/group.routes.js";
import expenseRoutes from "../modules/expenses/expense.routes.js";
import settlementRoutes from "../modules/settlement/settlement.routes.js";
import walletRoutes from "../modules/wallet/wallet.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/groups", groupRoutes);
router.use("/expense", expenseRoutes);
router.use("/settlements", settlementRoutes);
router.use("/wallet", walletRoutes);

export default router;
