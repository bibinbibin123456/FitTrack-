const express = require("express");
const {
    register,
    login,
    logout,
    getProfile,
    updateProfile
} = require("../../Controllers/userController");
const authMiddleware = require("../../middlewares/authMiddleware");
const { authRateLimit } = require("../../middlewares/rateLimiters");

const userRouter = express.Router();

userRouter.post("/register", authRateLimit, register);
userRouter.post("/login", authRateLimit, login);
userRouter.post("/logout", logout);
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.put("/profile", authMiddleware, updateProfile);

module.exports = userRouter;