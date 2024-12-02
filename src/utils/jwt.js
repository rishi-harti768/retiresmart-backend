import jwt from "jsonwebtoken";
import pool from "../db/database.js";

export const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const storeRefreshToken = async (id, refreshToken) => {
  await pool.query("update accounts set refresh_token = $2 where id = $1", [
    id,
    refreshToken,
  ]);
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const result = await pool.query(
      "SELECT * FROM accounts WHERE id = $1 AND refresh_token = $2",
      [decoded.id, token]
    );
    return result.rows.length > 0 ? decoded : null;
  } catch {
    return null;
  }
};
