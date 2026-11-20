import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { generateCoachPlan, getCoachAdvice } from "../../services/userServices";

const AICoach = () => {
  const [advice, setAdvice] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [preferences, setPreferences] = useState({
    goal: "maintain",
    experience: "beginner",
    dailyCalories: "2000",
    weightKg: "70",
  });

  const fetchAdvice = async () => {
    try {
      const response = await getCoachAdvice();
      setAdvice(response.data.advice || []);
      setSummary(response.data.summary);
      setWorkoutPlan(response.data.workoutPlan || []);
      setNutritionPlan(response.data.nutritionPlan || null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load coach insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    getCoachAdvice()
      .then((response) => {
        if (cancelled) return;
        setAdvice(response.data.advice || []);
        setSummary(response.data.summary);
        setWorkoutPlan(response.data.workoutPlan || []);
        setNutritionPlan(response.data.nutritionPlan || null);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error.response?.data?.error || "Failed to load coach insights");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const generatePlan = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await generateCoachPlan(preferences);
      setAdvice(response.data.advice || []);
      setSummary(response.data.summary);
      setWorkoutPlan(response.data.workoutPlan || []);
      setNutritionPlan(response.data.nutritionPlan || null);
      toast.success("Personalized plan generated");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-widest text-lime-500">Adaptive fitness intelligence</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">AI Fitness Coach</h1>

        <form onSubmit={generatePlan} className="mt-8 grid gap-4 rounded-3xl border border-base-300 bg-base-100 p-6 sm:grid-cols-2 lg:grid-cols-5">
          <label className="form-control">
            <span className="mb-2 text-sm font-semibold">Goal</span>
            <select className="select select-bordered" value={preferences.goal} onChange={(e) => setPreferences({ ...preferences, goal: e.target.value })}>
              <option value="lose">Lose fat</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain muscle</option>
            </select>
          </label>
          <label className="form-control">
            <span className="mb-2 text-sm font-semibold">Experience</span>
            <select className="select select-bordered" value={preferences.experience} onChange={(e) => setPreferences({ ...preferences, experience: e.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="form-control">
            <span className="mb-2 text-sm font-semibold">Current calories/day</span>
            <input type="number" min="800" className="input input-bordered" value={preferences.dailyCalories} onChange={(e) => setPreferences({ ...preferences, dailyCalories: e.target.value })} />
          </label>
          <label className="form-control">
            <span className="mb-2 text-sm font-semibold">Weight (kg)</span>
            <input type="number" min="30" className="input input-bordered" value={preferences.weightKg} onChange={(e) => setPreferences({ ...preferences, weightKg: e.target.value })} />
          </label>
          <button type="submit" className="btn self-end border-0 bg-lime-400 text-gray-950" disabled={loading}>
            Generate Plan
          </button>
        </form>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <span className="loading loading-spinner loading-lg text-lime-500"></span>
          </div>
        ) : (
          <>
            {summary && (
              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  ["Recent workouts", summary.recentWorkouts],
                  ["Active minutes", summary.recentMinutes],
                  ["Calories burned", summary.recentCaloriesBurned],
                  ["Today's calories", summary.todayFoodCalories],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-base-300 bg-base-100 p-5">
                    <p className="text-sm text-base-content/60">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-lime-500">{value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 space-y-4">
              {advice.map((item, index) => (
                <article key={item} className="flex gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 font-black text-gray-950">
                    {index + 1}
                  </span>
                  <p className="leading-7">{item}</p>
                </article>
              ))}
            </div>

            {nutritionPlan && (
              <section className="mt-8 rounded-3xl border border-base-300 bg-base-100 p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-lime-500">Nutrition plan</p>
                    <h2 className="mt-1 text-2xl font-bold capitalize">{nutritionPlan.goal}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-lg border-0 bg-lime-400 text-gray-950">{nutritionPlan.dailyCalories} kcal</span>
                    <span className="badge badge-lg badge-outline">{nutritionPlan.proteinGrams} g protein</span>
                    <span className="badge badge-lg badge-outline">{nutritionPlan.carbsGrams} g carbs</span>
                    <span className="badge badge-lg badge-outline">{nutritionPlan.fatGrams} g fat</span>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {nutritionPlan.mealTargets.map((meal) => (
                    <article key={meal.meal} className="rounded-2xl bg-base-200 p-4">
                      <p className="font-bold">{meal.meal}</p>
                      <p className="mt-1 text-lg font-black text-lime-500">{meal.calories} kcal</p>
                      <p className="mt-2 text-sm text-base-content/70">{meal.tip}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {workoutPlan.length > 0 && (
              <section className="mt-8">
                <p className="text-sm font-bold uppercase tracking-widest text-lime-500">7-day training plan</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {workoutPlan.map((day) => (
                    <article key={day.day} className="rounded-2xl border border-base-300 bg-base-100 p-5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black">{day.day}</h2>
                        <span className="badge badge-outline">{day.duration} min</span>
                      </div>
                      <p className="mt-2 font-semibold text-lime-500">{day.focus}</p>
                      <ul className="mt-3 space-y-2 text-sm text-base-content/75">
                        {day.exercises.map((exercise) => (
                          <li key={exercise}>• {exercise}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <button className="btn mt-6 border-0 bg-lime-400 text-gray-950" onClick={fetchAdvice} disabled={loading}>
          Refresh Insights
        </button>
      </div>
    </div>
  );
};

export default AICoach;
