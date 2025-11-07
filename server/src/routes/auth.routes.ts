import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/me", authenticate, getCurrentUser);
router.get("/logout", authenticate, logout);

export default router;
