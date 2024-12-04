import { verifyAccessToken } from "../utils/jwt.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
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

export const verifyToken = async (req, res, next) => {
  try {
    const accesstoken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(299).send();
    }
    if(!accesstoken){
      const decodeRefresh = jwt.decode(refreshToken, process.env.JWT_REFRESH_SECRET);
      const newAccessToken = jwt.sign({ id: decodeRefresh.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3600000, // 1hour
      }).status(299).send();

    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(221).json({ message: "Invalid token" });
  }
};
