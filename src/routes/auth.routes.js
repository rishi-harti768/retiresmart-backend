import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  forgotPassBefore,
  forgotPassAfter,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-pass-before", forgotPassBefore);
router.post("/forgot-pass-after", forgotPassAfter);

export default router;
