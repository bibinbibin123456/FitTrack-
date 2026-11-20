const { rateLimit } = require("express-rate-limit");

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a few minutes and try again.",
  },
});

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts. Please wait before trying again.",
  },
});

module.exports = { apiRateLimit, authRateLimit };
