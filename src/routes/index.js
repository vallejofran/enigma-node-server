import { Router } from "express";
const router = Router();

import authRoutes from "./auth-routes.js";
import protectedRoutes from "./protected-routes.js";

router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);

export default router;
