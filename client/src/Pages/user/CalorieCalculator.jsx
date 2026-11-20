import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoArrowForwardOutline,
  IoFlameOutline,
  IoFitnessOutline,
  IoNutritionOutline,
} from "react-icons/io5";
import { calculateCalorieNeeds } from "../../utils/calorieCalculator";

const initialForm = {
  age: "",
  weightKg: "",
  heightCm: "",
  equation: "average",
  activityLevel: "light",
  goal: "maintain",
};

const CalorieCalculator = () => {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      setResult(calculateCalorieNeeds(form));
      setError("");
    } catch (calculationError) {
      setResult(null);
      setError(calculationError.message);
    }
  };

  const fieldClass =
    "input input-bordered mt-2 w-full bg-base-100";
  const labelClass = "text-sm font-semibold";

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] bg-gray-950 text-white shadow-xl">
          <div className="grid lg:grid-cols-[1fr_0.85fr]">
            <div className="p-6 sm:p-10 lg:p-12">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-lime-300">
                <IoFitnessOutline className="text-lg" />
                Run · walk · refuel
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
                Find your daily calorie target.
              </h1>
              <p className="mt-4 max-w-xl leading-7 text-white/65">
                Get a simple estimate based on your body and how often you move.
                Use it as a starting point for steady training and balanced meals.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-white/75">
                <span className="rounded-full border border-white/15 px-4 py-2">Everyday movement</span>
                <span className="rounded-full border border-white/15 px-4 py-2">Balanced nutrition</span>
              </div>
            </div>
            <div className="relative hidden min-h-64 overflow-hidden lg:block">
              <img
                src="/images/onboarding-runner.jpg"
                alt="Runner training outdoors"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/30 to-transparent" />
              <div className="absolute bottom-8 right-8 rounded-2xl border border-white/15 bg-gray-950/70 p-4 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-widest text-lime-300">Progress, not perfection</p>
                <p className="mt-1 text-sm text-white/75">A useful estimate to guide your routine.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[1fr_0.82fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8"
          >
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-600">Your details</p>
              <h2 className="mt-1 text-2xl font-black">Make your estimate personal</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Age
                <input
                  className={fieldClass}
                  type="number"
                  name="age"
                  min="18"
                  max="100"
                  step="1"
                  required
                  value={form.age}
                  onChange={updateForm}
                  placeholder="e.g. 30"
                  inputMode="numeric"
                />
              </label>
              <label className={labelClass}>
                Weight (kg)
                <input
                  className={fieldClass}
                  type="number"
                  name="weightKg"
                  min="30"
                  max="300"
                  step="0.1"
                  required
                  value={form.weightKg}
                  onChange={updateForm}
                  placeholder="e.g. 68"
                  inputMode="decimal"
                />
              </label>
              <label className={labelClass}>
                Height (cm)
                <input
                  className={fieldClass}
                  type="number"
                  name="heightCm"
                  min="120"
                  max="230"
                  step="1"
                  required
                  value={form.heightCm}
                  onChange={updateForm}
                  placeholder="e.g. 170"
                  inputMode="numeric"
                />
              </label>
              <label className={labelClass}>
                Equation adjustment
                <select
                  className="select select-bordered mt-2 w-full bg-base-100"
                  name="equation"
                  value={form.equation}
                  onChange={updateForm}
                >
                  <option value="average">Average estimate</option>
                  <option value="female">Female equation</option>
                  <option value="male">Male equation</option>
                </select>
              </label>
              <label className={labelClass}>
                Activity level
                <select
                  className="select select-bordered mt-2 w-full bg-base-100"
                  name="activityLevel"
                  value={form.activityLevel}
                  onChange={updateForm}
                >
                  <option value="low">Mostly sitting, little planned exercise</option>
                  <option value="light">Easy walks or runs 1–3 days/week</option>
                  <option value="moderate">Walks or runs 3–5 days/week</option>
                  <option value="high">Training most days of the week</option>
                  <option value="veryHigh">Daily intense training or active work</option>
                </select>
              </label>
              <label className={labelClass}>
                Your goal
                <select
                  className="select select-bordered mt-2 w-full bg-base-100"
                  name="goal"
                  value={form.goal}
                  onChange={updateForm}
                >
                  <option value="maintain">Maintain my weight</option>
                  <option value="lose">Gradual weight loss</option>
                  <option value="gain">Gradual weight gain</option>
                </select>
              </label>
            </div>

            {error && (
              <p className="mt-4 text-sm font-semibold text-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="btn mt-6 w-full border-0 bg-lime-400 text-gray-950 hover:bg-lime-300 sm:w-auto sm:px-8"
            >
              <IoFlameOutline className="text-lg" />
              Calculate my calories
            </button>
          </form>

          <section
            className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8"
            aria-live="polite"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-lime-600">Your estimate</p>
            {result ? (
              <>
                <p className="mt-3 text-5xl font-black tracking-tight">
                  {result.dailyCalories.toLocaleString()}
                  <span className="ml-2 text-base font-semibold text-base-content/55">kcal/day</span>
                </p>
                <p className="mt-2 text-sm text-base-content/60">Suggested daily target · an estimate, not a prescription</p>
                {result.dailyCalories < 1200 && (
                  <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    This estimate is unusually low. Do not use it as a diet target
                    without advice from a qualified health professional.
                  </p>
                )}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ["Resting estimate", result.basalCalories, "kcal"],
                    ["Maintenance estimate", result.maintenanceCalories, "kcal"],
                    ["Protein guide", result.proteinGrams, "g"],
                    ["Fat guide", result.fatGrams, "g"],
                    ["Carbohydrate guide", result.carbsGrams, "g"],
                  ].map(([label, amount, unit]) => (
                    <div key={label} className="rounded-2xl bg-base-200 p-4">
                      <p className="text-xs font-semibold text-base-content/55">{label}</p>
                      <p className="mt-1 text-xl font-black">
                        {amount.toLocaleString()} <span className="text-xs font-semibold">{unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link to="/food" className="btn flex-1 border-0 bg-gray-950 text-white hover:bg-gray-800">
                    <IoNutritionOutline />
                    Track meals
                    <IoArrowForwardOutline />
                  </Link>
                  <Link to="/ai-coach" className="btn flex-1 border border-base-300 bg-base-100">
                    Build a plan
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-2xl bg-base-200 p-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-300/25 text-2xl text-lime-700">
                  <IoFlameOutline />
                </div>
                <h2 className="mt-4 text-xl font-bold">Start with your details</h2>
                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  Add your age, height, weight, and usual activity to see a daily calorie range and simple macro guide.
                </p>
              </div>
            )}
            <p className="mt-5 text-xs leading-5 text-base-content/55">
              This estimate uses the Mifflin–St Jeor equation and general activity multipliers. Actual needs vary; this tool is for adults and is not medical advice. For a tailored plan or health condition, speak with a qualified health professional.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;
