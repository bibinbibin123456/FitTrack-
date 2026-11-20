
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

// Registration
userRouter.post("/register", authRateLimit, register);

// Login
userRouter.post("/login", authRateLimit, login);

// Logout
userRouter.post("/logout", logout);

// Get user profile
userRouter.get("/profile", authMiddleware, getProfile);

// Update user profile
userRouter.put("/profile", authMiddleware, updateProfile);

module.exports = userRouter;
