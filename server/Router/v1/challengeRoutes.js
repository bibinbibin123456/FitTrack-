const express = require("express");

const {
    createChallenge,
    getAllChallenge,
    joinChallenge,
    getChallengeById,
    getChallengeProgress,
    getChallengeLeaderboard
} = require("../../Controllers/challengeController");

const authMiddleware = require("../../middlewares/authMiddleware");

const challengeRouter = express.Router();

challengeRouter.post(
    "/create",
    authMiddleware,
    createChallenge
);

challengeRouter.get(
    "/all",
    authMiddleware,
    getAllChallenge
);

challengeRouter.post(
    "/join/:id",
    authMiddleware,
    joinChallenge
);

challengeRouter.get(
    "/:id",
    authMiddleware,
    getChallengeById
);
challengeRouter.get(
    "/:id/progress",
    authMiddleware,
    getChallengeProgress
);
challengeRouter.get(
    "/:id/leaderboard",
    authMiddleware,
    getChallengeLeaderboard
);

module.exports = challengeRouter;