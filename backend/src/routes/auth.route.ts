import express, { Request, Response } from "express";
import { login, logout, signup, refreshToken } from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
// router.post("/Profile", protectRoute, getProfile);
export default router;