import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import pool, { initDB } from "./db/database.js";
// import { authenticateToken } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);
// app.use("/account", accountRoutes);

initDB();

// Protected route example

/* app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted", userId: req.userId });
}); */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
