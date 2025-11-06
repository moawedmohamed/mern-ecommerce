import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { createCheckoutSession, createCheckoutSuccess } from "../controllers/payment.controller";

const router = Router();
router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", createCheckoutSuccess);

export default router;