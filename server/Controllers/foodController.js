const FoodDb = require("../Models/foodModel");
const {
  sanitizeText,
  isValidObjectId,
  parseNumber,
} = require("../Utilities/inputValidation");

const mealTypes = new Set(["breakfast", "lunch", "dinner", "snack"]);

const getFoods = async (req, res) => {
  try {
    const entries = await FoodDb.find({ userId: req.user.id }).sort({
      date: -1,
      createdAt: -1,
    });
    return res.status(200).json({ entries });
  } catch (error) {
    console.error("Get food entries error:", error);
    return res.status(500).json({ error: "Failed to fetch food entries" });
  }
};

const addFood = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, mealType, date } = req.body || {};
    const cleanName = sanitizeText(name, 100);
    const parsedCalories = parseNumber(calories);
    const parsedProtein = protein === undefined || protein === "" ? 0 : parseNumber(protein);
    const parsedCarbs = carbs === undefined || carbs === "" ? 0 : parseNumber(carbs);
    const parsedFat = fat === undefined || fat === "" ? 0 : parseNumber(fat);
    const selectedMeal = mealType === undefined ? "snack" : mealType;

    if (!cleanName || parsedCalories === null) {
      return res.status(400).json({ error: "Food name and calories are required" });
    }

    const values = [parsedCalories, parsedProtein, parsedCarbs, parsedFat];
    if (
      values.some((value) => value === null || value < 0 || value > 10000) ||
      !mealTypes.has(selectedMeal)
    ) {
      return res.status(400).json({ error: "Nutrition values must be valid positive numbers" });
    }

    let entryDate;
    if (date !== undefined) {
      entryDate = new Date(date);
      if (Number.isNaN(entryDate.getTime())) {
        return res.status(400).json({ error: "Food date is invalid" });
      }
    }

    const entry = await FoodDb.create({
      userId: req.user.id,
      name: cleanName,
      calories: values[0],
      protein: values[1] || 0,
      carbs: values[2] || 0,
      fat: values[3] || 0,
      mealType: selectedMeal,
      date: entryDate,
    });

    return res.status(201).json({
      message: "Food entry added successfully",
      entry,
    });
  } catch (error) {
    console.error("Add food entry error:", error);
    return res.status(500).json({ error: "Failed to add food entry" });
  }
};

const deleteFood = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Food entry ID is invalid" });
    }

    const entry = await FoodDb.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ error: "Food entry not found" });
    }

    return res.status(200).json({ message: "Food entry deleted successfully" });
  } catch (error) {
    console.error("Delete food entry error:", error);
    return res.status(500).json({ error: "Failed to delete food entry" });
  }
};

module.exports = { getFoods, addFood, deleteFood };
