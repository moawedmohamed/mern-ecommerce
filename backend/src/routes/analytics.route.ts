import { Router } from "express";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware";
import { createAnalytics } from "../controllers/analytics.controller";

const router = Router();
router.get('/', protectRoute, adminRoute,createAnalytics)
export default router