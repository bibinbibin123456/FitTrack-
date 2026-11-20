const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { getFoods, addFood, deleteFood } = require("../../Controllers/foodController");

const foodRouter = express.Router();

foodRouter.get("/", authMiddleware, getFoods);
foodRouter.post("/", authMiddleware, addFood);
foodRouter.delete("/:id", authMiddleware, deleteFood);

module.exports = foodRouter;
