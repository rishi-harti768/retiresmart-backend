import { verifyAccessToken } from "../utils/jwt.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(410).json({ error: "Access token required" });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(411).json({ error: "Invalid or expired access token" });
  }

  req.userId = decoded.userId;
  next();
};
