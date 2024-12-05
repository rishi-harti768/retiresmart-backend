import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import genAIRoutes from "./routes/genAI.routes.js";
import pool, { initDB } from "./db/database.js";
import { authenticateToken } from "./middleware/auth.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Auth routes
app.use("/auth", authRoutes);
app.use("/account", accountRoutes);
app.use("/ai", genAIRoutes);

initDB();

// Protected route example

/* app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted", userId: req.userId });
}); */

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
