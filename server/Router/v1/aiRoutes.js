const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { getCoachAdvice } = require("../../Controllers/aiController");

const aiRouter = express.Router();
aiRouter.get("/coach", authMiddleware, getCoachAdvice);
aiRouter.post("/coach", authMiddleware, getCoachAdvice);

module.exports = aiRouter;
