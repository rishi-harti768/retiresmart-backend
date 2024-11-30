import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { initializeDatabase } from "./config/database.js";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import profileroute from "./routes/profileRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/profile", profileroute);

initializeDatabase();

app.listen(7890, () => {
  console.log("Server is running on port 7890");
});

export default app;
