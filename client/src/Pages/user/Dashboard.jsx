import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  IoAddOutline,
  IoArrowForward,
  IoFlameOutline,
  IoFitnessOutline,
  IoNutritionOutline,
  IoTrophyOutline,
  IoWalkOutline,
} from "react-icons/io5";
import {
  getAllChallenges,
  getFoodEntries,
  getUserWorkouts,
} from "../../services/userServices";

const localDayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const [workouts, setWorkouts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [foodEntries, setFoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [currentDate] = useState(() => new Date());

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const results = await Promise.allSettled([
        getUserWorkouts(),
        getAllChallenges(),
        getFoodEntries(),
      ]);

      if (!active) return;

      const [workoutResult, challengeResult, foodResult] = results;
      const errors = [];

      if (workoutResult.status === "fulfilled") {
        setWorkouts(workoutResult.value.data?.workouts || []);
      } else {
        errors.push("workout history");
      }

      if (challengeResult.status === "fulfilled") {
        setChallenges(challengeResult.value.data?.challenges || []);
      } else {
        errors.push("challenges");
      }

      if (foodResult.status === "fulfilled") {
        setFoodEntries(foodResult.value.data?.entries || []);
      } else {
        errors.push("nutrition entries");
      }

      if (errors.length) {
        setLoadError(`Some dashboard data could not load: ${errors.join(", ")}.`);
      }
      setLoading(false);
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const todayKey = localDayKey(currentDate);
  const weekStart = new Date(currentDate);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - 6);

  const weekWorkouts = workouts.filter((workout) => {
    const date = new Date(workout.date || workout.createdAt);
    return !Number.isNaN(date.getTime()) && date >= weekStart;
  });

  const todayFood = foodEntries.filter(
    (entry) => localDayKey(new Date(entry.date)) === todayKey
  );
  const todayFoodCalories = todayFood.reduce(
    (sum, entry) => sum + Number(entry.calories || 0),
    0
  );
  const weeklyMinutes = weekWorkouts.reduce(
    (sum, workout) => sum + Number(workout.duration || 0),
    0
  );
  const weeklyDistance = weekWorkouts.reduce(
    (sum, workout) => sum + Number(workout.distance || 0),
    0
  );
  const weeklyCalories = weekWorkouts.reduce(
    (sum, workout) => sum + Number(workout.calories || 0),
    0
  );
  const movementGoal = 150;
  const movementPercent = Math.min(
    Math.round((weeklyMinutes / movementGoal) * 100),
    100
  );

  const weeklyChart = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(currentDate);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - offset);
    const key = localDayKey(day);
    const minutes = workouts.reduce((sum, workout) => {
      const workoutDate = new Date(workout.date || workout.createdAt);
      return localDayKey(workoutDate) === key
        ? sum + Number(workout.duration || 0)
        : sum;
    }, 0);
    weeklyChart.push({
      key,
      label: day.toLocaleDateString(undefined, { weekday: "short" }),
      minutes,
    });
  }
  const maxWeeklyMinutes = Math.max(
    ...weeklyChart.map((day) => day.minutes),
    30
  );

  const joinedChallenges = challenges.filter((challenge) =>
    challenge.participants?.some((participant) => {
      const participantId =
        typeof participant === "object" && participant !== null
          ? participant._id || participant.id
          : participant;
      const userId = user?._id || user?.id || user?.userId;
      return participantId && userId && String(participantId) === String(userId);
    })
  );

  const recentWorkouts = [...workouts]
    .sort(
      (a, b) =>
        new Date(b.date || b.createdAt || 0) -
        new Date(a.date || a.createdAt || 0)
    )
    .slice(0, 4);

  const weekStreak = (() => {
    const activityDates = new Set(
      workouts.map((workout) =>
        localDayKey(new Date(workout.date || workout.createdAt))
      )
    );
    const cursor = new Date(currentDate);
    cursor.setHours(0, 0, 0, 0);
    if (!activityDates.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
    let days = 0;
    while (activityDates.has(localDayKey(cursor))) {
      days += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return days;
  })();

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-lime-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-base-content/55">
              {currentDate.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              Good to see you{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
            </h1>
            <p className="mt-2 text-base-content/65">
              A quick look at your movement, meals, and goals.
            </p>
          </div>
          <Link
            to="/workouts"
            className="btn border-0 bg-lime-400 px-5 text-gray-950 hover:bg-lime-300"
          >
            <IoAddOutline className="text-xl" />
            Log workout
          </Link>
        </div>

        {loadError && (
          <div role="status" className="alert mb-5 border-amber-300 bg-amber-50 text-amber-950">
            <span>{loadError}</span>
          </div>
        )}

        <section className="grid items-stretch gap-6 lg:grid-cols-2">
          <article className="relative min-h-[290px] overflow-hidden rounded-3xl border border-emerald-300/10 bg-gradient-to-br from-[#144b3f] via-[#103c38] to-[#102b30] p-6 text-white shadow-sm sm:p-8">
            <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[34px] border-white/10" />
            <div className="relative flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-center">
              <div className="max-w-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-200/80">
                  Your weekly movement
                </p>
                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  Small steps add up.
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Weekly movement minutes are based on the workouts you’ve logged.
                </p>
                <Link
                  to="/workouts"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-lime-200 hover:gap-3 hover:text-lime-100"
                >
                  View workout history <IoArrowForward />
                </Link>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <div
                  className="relative grid h-32 w-32 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(#a3e635 ${movementPercent * 3.6}deg, rgba(163,230,53,.16) 0deg)`,
                  }}
                  role="img"
                  aria-label={`${movementPercent}% of weekly movement guideline`}
                >
                  <div className="grid h-[102px] w-[102px] place-content-center rounded-full bg-[#144b3f] text-center">
                    <span className="text-3xl font-black text-lime-200">{movementPercent}%</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-white/65">
                      of 150 min
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black">{weeklyMinutes}</p>
                  <p className="text-sm text-white/75">active min</p>
                  <p className="mt-2 text-xs text-white/60">
                    {Math.max(movementGoal - weeklyMinutes, 0)} min to go
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="min-h-[290px] rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-base-content/50">
                  Today’s nutrition
                </p>
                <h2 className="mt-2 text-2xl font-black">Food log</h2>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-800">
                <IoNutritionOutline className="text-xl" />
              </span>
            </div>
            <div className="mt-7 flex items-end justify-between">
              <p className="text-4xl font-black">{todayFoodCalories.toLocaleString()}</p>
              <p className="mb-1 text-sm text-base-content/55">kcal logged today</p>
            </div>
            <p className="mt-1 text-sm text-base-content/55">
              {todayFood.length} meal{todayFood.length === 1 ? "" : "s"} recorded
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              <Link
                to="/food"
                className="inline-flex items-center gap-2 text-sm font-bold text-base-content hover:gap-3 hover:underline"
              >
                Open food tracker <IoArrowForward />
              </Link>
              <Link
                to="/calorie-calculator"
                className="inline-flex items-center gap-2 text-sm font-bold text-base-content hover:gap-3 hover:underline"
              >
                Set a personal target <IoArrowForward />
              </Link>
            </div>
          </article>
        </section>

        <section className="mt-6 grid items-stretch gap-6 lg:grid-cols-2">
          <article className="flex min-h-[360px] flex-col rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">Your activity</h2>
                <p className="mt-1 text-sm text-base-content/55">
                  Logged workout minutes, last 7 days
                </p>
              </div>
              <span className="rounded-full bg-lime-300/15 px-3 py-1 text-xs font-bold text-lime-300">
                {weekStreak} day streak
              </span>
            </div>

            <div className="mt-auto grid h-48 grid-cols-7 items-end gap-3 pt-6 sm:gap-5">
              {weeklyChart.map((day) => {
                const height = day.minutes
                  ? Math.max(Math.round((day.minutes / maxWeeklyMinutes) * 100), 8)
                  : 4;
                return (
                  <div key={day.key} className="flex h-full flex-col items-center justify-end gap-2">
                    <span className="text-[10px] font-semibold text-base-content/45">
                      {day.minutes > 0 ? `${day.minutes}m` : ""}
                    </span>
                    <div className="flex h-28 w-full items-end rounded-t-xl bg-base-200">
                      <div
                        className={`w-full rounded-t-xl ${day.key === todayKey ? "bg-lime-500" : "bg-lime-300"}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-base-content/55">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </article>

          <div className="grid auto-rows-fr grid-cols-2 gap-4">
            {[
              {
                label: "Workouts",
                value: weekWorkouts.length,
                detail: "this week",
                icon: IoFitnessOutline,
                color: "bg-sky-50 text-sky-800",
              },
              {
                label: "Distance",
                value: `${weeklyDistance.toFixed(1)} km`,
                detail: "this week",
                icon: IoWalkOutline,
                color: "bg-violet-50 text-violet-800",
              },
              {
                label: "Calories burned",
                value: weeklyCalories.toLocaleString(),
                detail: "from workouts",
                icon: IoFlameOutline,
                color: "bg-orange-50 text-orange-800",
              },
              {
                label: "Challenges",
                value: joinedChallenges.length,
                detail: "joined",
                icon: IoTrophyOutline,
                color: "bg-amber-50 text-amber-800",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <article
                  key={stat.label}
                  className="flex min-h-[168px] flex-col rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5"
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${stat.color}`}>
                    <Icon className="text-xl" />
                  </span>
                  <p className="mt-4 text-xs font-semibold text-base-content/55 sm:text-sm">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-black sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-base-content/45">{stat.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid items-stretch gap-6 lg:grid-cols-2">
          <article className="min-h-[340px] rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">Recent workouts</h2>
                <p className="mt-1 text-sm text-base-content/55">Your latest logged activity</p>
              </div>
              <Link to="/workouts" className="text-sm font-bold text-emerald-800 hover:underline">
                View all
              </Link>
            </div>
            {recentWorkouts.length === 0 ? (
              <div className="rounded-2xl bg-base-200/70 px-5 py-8 text-center">
                <IoFitnessOutline className="mx-auto text-3xl text-base-content/35" />
                <p className="mt-2 font-bold">Your activity starts here</p>
                <p className="mt-1 text-sm text-base-content/55">
                  Log your first workout to see your progress.
                </p>
                <Link to="/workouts" className="btn btn-sm mt-4 border-0 bg-emerald-800 text-white hover:bg-emerald-900">
                  Log a workout
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-base-200">
                {recentWorkouts.map((workout) => (
                  <div key={workout._id} className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
                        <IoFitnessOutline className="text-xl" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold capitalize">{workout.workoutType || "Workout"}</p>
                        <p className="text-xs text-base-content/50">
                          {new Date(workout.date || workout.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-bold">{workout.duration || 0} min</p>
                      <p className="text-xs text-base-content/50">
                        {Number(workout.distance || 0).toFixed(1)} km · {workout.calories || 0} kcal
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="min-h-[340px] rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black">A little help goes a long way</h2>
            <p className="mt-1 text-sm text-base-content/55">
              Choose what you want to focus on next.
            </p>
            <div className="mt-5 space-y-3">
              {[
                {
                  to: "/gps-tracker",
                  title: "Track an outdoor session",
                  description: "Use GPS to measure distance and time.",
                  icon: IoWalkOutline,
                },
                {
                  to: "/challenges",
                  title: "Find a challenge",
                  description: "Set a shared goal and stay motivated.",
                  icon: IoTrophyOutline,
                },
                {
                  to: "/ai-coach",
                  title: "Build a weekly plan",
                  description: "Get a workout and nutrition starting point.",
                  icon: IoNutritionOutline,
                },
                {
                  to: "/calorie-calculator",
                  title: "Estimate daily calories",
                  description: "Set a simple target for your movement and meals.",
                  icon: IoFlameOutline,
                },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="group flex items-center gap-3 rounded-2xl bg-base-200/70 p-3 hover:bg-base-200"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-base-100 text-base-content shadow-sm">
                      <Icon className="text-xl" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">{action.title}</span>
                      <span className="mt-0.5 block text-xs text-base-content/55">{action.description}</span>
                    </span>
                    <IoArrowForward className="shrink-0 text-base-content/40 group-hover:translate-x-1 group-hover:text-base-content" />
                  </Link>
                );
              })}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
