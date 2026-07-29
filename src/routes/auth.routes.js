import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import {
  authConfig,
  createSessionToken,
  login,
  logout,
  me,
  register
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/auth-config", asyncHandler(authConfig));
router.post("/session-token", asyncHandler(createSessionToken));
router.get("/me", requireAuth, asyncHandler(me));
router.post("/logout", asyncHandler(logout));

export default router;
