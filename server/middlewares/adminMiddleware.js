const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const bearerToken =
      typeof authorization === "string" && authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;
    const token = req.cookies?.token || bearerToken;

    if (!token) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.admin = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired admin session" });
  }
};

module.exports = adminMiddleware;
