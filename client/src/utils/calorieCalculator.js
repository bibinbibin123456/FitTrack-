const activityMultipliers = {
  low: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  veryHigh: 1.9,
};

const equationAdjustments = {
  female: -161,
  male: 5,
  average: -78,
};

const goalAdjustments = {
  lose: -300,
  maintain: 0,
  gain: 250,
};

const hasOption = (options, value) =>
  Object.prototype.hasOwnProperty.call(options, value);

export const calculateCalorieNeeds = ({
  age,
  weightKg,
  heightCm,
  activityLevel,
  equation,
  goal,
}) => {
  const ageValue = Number(age);
  const weightValue = Number(weightKg);
  const heightValue = Number(heightCm);

  if (
    !Number.isFinite(ageValue) ||
    ageValue < 18 ||
    ageValue > 100 ||
    !Number.isFinite(weightValue) ||
    weightValue < 30 ||
    weightValue > 300 ||
    !Number.isFinite(heightValue) ||
    heightValue < 120 ||
    heightValue > 230 ||
    !hasOption(activityMultipliers, activityLevel) ||
    !hasOption(equationAdjustments, equation) ||
    !hasOption(goalAdjustments, goal)
  ) {
    throw new Error("Enter valid adult measurements and preferences.");
  }

  const basalCalories = Math.round(
    10 * weightValue +
      6.25 * heightValue -
      5 * ageValue +
      equationAdjustments[equation]
  );
  const maintenanceCalories = Math.round(
    basalCalories * activityMultipliers[activityLevel]
  );
  const dailyCalories = Math.max(
    0,
    maintenanceCalories + goalAdjustments[goal]
  );
  const proteinGrams = Math.round(weightValue * 1.6);
  const fatGrams = Math.round(weightValue * 0.8);
  const carbsGrams = Math.max(
    0,
    Math.round((dailyCalories - proteinGrams * 4 - fatGrams * 9) / 4)
  );

  return {
    basalCalories,
    maintenanceCalories,
    dailyCalories,
    proteinGrams,
    fatGrams,
    carbsGrams,
  };
};
