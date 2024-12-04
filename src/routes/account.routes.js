import express from "express";
import { accountVerifyBefore } from "../controllers/account.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/account-verify-before", authenticateToken, accountVerifyBefore);

export default router;
