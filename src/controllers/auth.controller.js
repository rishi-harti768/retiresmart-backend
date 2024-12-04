import bcrypt from "bcryptjs";
import pool from "../db/database.js";
import cookieParser from "cookie-parser";
import { cookie } from "express-validator";
import {
  generateTokens,
  storeRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendForgotPasswordEmail } from "../utils/emailService.js";

const genToken = () => {
  let token = "";
  for (let i = 0; i < 16; i++) {
    token += Math.floor(Math.random() * 10).toString();
  }
  return token;
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      "SELECT id FROM accounts WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(401).send("");
    }
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO accounts (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashedPassword]
    );

    const { accessToken, refreshToken } = generateTokens(result.rows[0].id);

    // Store refresh token
    await storeRefreshToken(result.rows[0].id, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000, // 1hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 604800000, //7days
    });

    res.status(200).send();
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      "SELECT id, password FROM accounts WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      //no account exist
      return res.status(401).send();
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(402).send();
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Store refresh token
    await storeRefreshToken(user.id, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000, // 1hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 604800000, //7days
    });

    res.status(200).send();
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      // no refresh token
      return res.status(401).send();
    }

    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res
        .status(402)
        .json({ error: "Invalid or expired refresh token" });
    }
    console.log(decoded.id);

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(decoded.id);
    console.log(newAccessToken, newRefreshToken);

    // Remove old refresh token and store new one
    await storeRefreshToken(decoded.id, newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// needs review
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await query("DELETE FROM refresh_tokens WHERE token = $1", [
        refreshToken,
      ]);
    }
    res.status(200).send();
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const forgotPassBefore = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query("SELECT * FROM accounts WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).send("");
    }
    /* if (result.rows[0].password_token !== null) {
      return res.status(402).send("");
    } */
    const token = genToken();
    const update = await pool.query(
      "UPDATE accounts SET password_token = $1 WHERE email = $2",
      [token, email]
    );
    await sendForgotPasswordEmail(email, token);
    res.status(200).send("");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const forgotPassAfter = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM accounts WHERE email = $1 and password_token = $2",
      [email, token]
    );
    if (result.rows.length === 0) {
      return res.status(401).send("");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const update = await pool.query(
      "UPDATE accounts SET password = $1, password_token = null WHERE email = $2",
      [hashedPassword, email]
    );
    res.status(200).send("");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
