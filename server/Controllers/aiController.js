const WorkoutDb = require("../Models/workoutModel");
const FoodDb = require("../Models/foodModel");

const getCoachAdvice = async (req, res) => {
  try {
    const {
      goal = "maintain",
      experience = "beginner",
      dailyCalories,
      weightKg,
    } = req.body || {};

    const [workouts, foods] = await Promise.all([
      WorkoutDb.find({ userId: req.user.id }).sort({ date: -1 }).limit(30),
      FoodDb.find({ userId: req.user.id }).sort({ date: -1 }).limit(30),
    ]);

    const totalMinutes = workouts.reduce((sum, item) => sum + Number(item.duration || 0), 0);
    const totalCaloriesBurned = workouts.reduce((sum, item) => sum + Number(item.calories || 0), 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFoodCalories = foods
      .filter((item) => new Date(item.date) >= today)
      .reduce((sum, item) => sum + Number(item.calories || 0), 0);

    const advice = [];
    if (workouts.length === 0) {
      advice.push("Start with a manageable 20-minute walk today and gradually increase your pace.");
    } else if (totalMinutes < 150) {
      advice.push("You are building momentum. Aim for at least 150 minutes of activity across the week.");
    } else {
      advice.push("Excellent consistency. Include a rest or easy activity day to support recovery.");
    }

    if (todayFoodCalories > 2200) {
      advice.push("Today's logged food calories are above a common daily target. Choose lighter, nutrient-dense meals for the rest of the day.");
    } else {
      advice.push("Build meals around protein, vegetables, whole grains, and enough water.");
    }

    advice.push(`Your recent activity totals ${totalMinutes} minutes and approximately ${totalCaloriesBurned} kcal burned.`);

    const goalSettings = {
      lose: { calorieOffset: -400, label: "fat loss", proteinRatio: 1.8 },
      maintain: { calorieOffset: 0, label: "maintenance", proteinRatio: 1.6 },
      gain: { calorieOffset: 300, label: "muscle gain", proteinRatio: 2.0 },
    };
    const selectedGoal = goalSettings[goal] || goalSettings.maintain;

    const baseCalories = Number(dailyCalories) > 800
      ? Number(dailyCalories)
      : 2000;
    const calorieTarget = Math.max(
      1200,
      baseCalories + selectedGoal.calorieOffset
    );

    const durationByLevel = {
      beginner: 25,
      intermediate: 40,
      advanced: 55,
    };
    const sessionMinutes = durationByLevel[experience] || 25;
    const weight = Number(weightKg) > 30 ? Number(weightKg) : 70;
    const proteinTarget = Math.round(weight * selectedGoal.proteinRatio);
    const carbsTarget = Math.round((calorieTarget * 0.45) / 4);
    const fatTarget = Math.round((calorieTarget * 0.25) / 9);

    const workoutPlan = [
      {
        day: "Monday",
        focus: "Cardio + core",
        duration: sessionMinutes,
        exercises: experience === "beginner"
          ? ["20 min brisk walking", "3 x 30 sec planks", "3 x 12 glute bridges"]
          : ["30 min incline running or cycling", "4 x 30 sec planks", "3 x 15 mountain climbers"],
      },
      {
        day: "Tuesday",
        focus: "Full-body strength",
        duration: sessionMinutes,
        exercises: ["3 x 10 squats", "3 x 10 push-ups", "3 x 12 dumbbell rows", "2 x 30 sec side planks"],
      },
      {
        day: "Wednesday",
        focus: "Active recovery",
        duration: Math.max(15, sessionMinutes - 10),
        exercises: ["10 min easy walk", "8 min mobility", "5 min breathing or stretching"],
      },
      {
        day: "Thursday",
        focus: goal === "gain" ? "Upper body strength" : "Interval cardio",
        duration: sessionMinutes,
        exercises: goal === "gain"
          ? ["4 x 8-12 chest presses", "4 x 10 rows", "3 x 10 shoulder presses", "3 x 12 curls"]
          : ["5 min warm-up", "8 x 30 sec fast / 90 sec easy", "5 min cool-down"],
      },
      {
        day: "Friday",
        focus: "Lower body strength",
        duration: sessionMinutes,
        exercises: ["3 x 12 lunges", "3 x 12 Romanian deadlifts", "3 x 15 calf raises", "2 x 45 sec wall sits"],
      },
      {
        day: "Saturday",
        focus: "Enjoyable endurance",
        duration: sessionMinutes + 10,
        exercises: ["Brisk walking, running, cycling or swimming", "Keep a conversational pace", "Finish with 5 minutes of mobility"],
      },
      {
        day: "Sunday",
        focus: "Recovery",
        duration: 15,
        exercises: ["Easy walk", "Full-body stretching", "Optional foam rolling"],
      },
    ];

    const nutritionPlan = {
      goal: selectedGoal.label,
      dailyCalories: calorieTarget,
      proteinGrams: proteinTarget,
      carbsGrams: carbsTarget,
      fatGrams: fatTarget,
      mealTargets: [
        { meal: "Breakfast", calories: Math.round(calorieTarget * 0.25), tip: "Protein + fruit + whole grains" },
        { meal: "Lunch", calories: Math.round(calorieTarget * 0.35), tip: "Lean protein + vegetables + complex carbs" },
        { meal: "Dinner", calories: Math.round(calorieTarget * 0.30), tip: "Protein + salad or cooked vegetables" },
        { meal: "Snack", calories: Math.round(calorieTarget * 0.10), tip: "Greek yogurt, nuts, fruit or eggs" },
      ],
    };

    return res.status(200).json({
      advice,
      workoutPlan,
      nutritionPlan,
      summary: {
        recentWorkouts: workouts.length,
        recentMinutes: totalMinutes,
        recentCaloriesBurned: totalCaloriesBurned,
        todayFoodCalories,
      },
    });
  } catch (error) {
    console.error("AI coach error:", error);
    return res.status(500).json({ error: "Failed to generate fitness guidance" });
  }
};

module.exports = { getCoachAdvice };
