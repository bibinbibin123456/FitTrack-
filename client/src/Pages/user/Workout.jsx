import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addWorkout,
  getUserWorkouts,
  deleteWorkout,
} from "../../services/userServices";
import { Button } from "../../components/common/Button";

const Workouts = () => {
  const [formData, setFormData] = useState({
    workoutType: "Running",
    distance: "",
    duration: "",
    calories: "",
  });

  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch workout history
  const fetchWorkouts = async () => {
    try {
      const response = await getUserWorkouts();

      setWorkouts(response.data.workouts || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load workout history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load history when the page opens
  useEffect(() => {
    let cancelled = false;

    getUserWorkouts()
      .then((response) => {
        if (!cancelled) setWorkouts(response.data.workouts || []);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(
            error.response?.data?.message || "Failed to load workout history."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.distance === "" ||
      formData.duration === "" ||
      formData.calories === "" ||
      !Number.isFinite(Number(formData.distance)) ||
      !Number.isFinite(Number(formData.duration)) ||
      !Number.isFinite(Number(formData.calories)) ||
      Number(formData.distance) < 0 ||
      Number(formData.duration) <= 0 ||
      Number(formData.calories) < 0
    ) {
      toast.error("Please enter valid workout values.");
      return;
    }

    try {
      setLoading(true);

      const response = await addWorkout({
        ...formData,
        distance: Number(formData.distance),
        duration: Number(formData.duration),
        calories: Number(formData.calories),
      });

      toast.success(
        response.data.message || "Workout added successfully!"
      );

      setFormData({
        workoutType: "Running",
        distance: "",
        duration: "",
        calories: "",
      });

      // Refresh history after saving
      await fetchWorkouts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to add workout."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a workout
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await deleteWorkout(id);

      setWorkouts((prev) =>
        prev.filter((workout) => workout._id !== id)
      );

      toast.success(
        response.data.message || "Workout deleted successfully!"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete workout."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="font-bold uppercase tracking-widest text-lime-500">
            FitTrack
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Track Your Workout
          </h1>

          <p className="mt-3 text-base-content/70">
            Record your activity and keep moving towards your goals.
          </p>
        </div>

        {/* Add Workout Form — your existing form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8"
        >
          <div>
            <label className="mb-2 block font-semibold">
              Workout Type
            </label>

            <select
              name="workoutType"
              value={formData.workoutType}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Running">Running</option>
              <option value="Walking">Walking</option>
              <option value="Cycling">Cycling</option>
              <option value="Workout">Workout</option>
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">
                Distance (km)
              </label>

              <input
                type="number"
                name="distance"
                min="0"
                step="0.1"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g. 5.4"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Duration (minutes)
              </label>

              <input
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 30"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block font-semibold">
                Calories Burned (kcal)
              </label>

              <input
                type="number"
                name="calories"
                min="0"
                value={formData.calories}
                onChange={handleChange}
                placeholder="e.g. 250"
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving Workout..." : "Save Workout"}
          </Button>
        </form>

        {/* Workout History */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">
              Workout History
            </h2>

            <span className="badge badge-success badge-outline">
              {workouts.length} workouts
            </span>
          </div>

          {historyLoading ? (
            <p className="py-8 text-center text-base-content/70">
              Loading workout history...
            </p>
          ) : workouts.length === 0 ? (
            <div className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center">
              <h3 className="text-lg font-bold">
                No workouts yet
              </h3>

              <p className="mt-2 text-base-content/70">
                Save your first workout using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout._id}
                  className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-lg font-bold">
                        {workout.workoutType}
                      </h3>

                      <p className="mt-1 text-sm text-base-content/60">
                        {workout.date
                          ? new Date(workout.date).toLocaleDateString()
                          : "Date unavailable"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        <span>
                          🛣️ {workout.distance} km
                        </span>

                        <span>
                          ⏱️ {workout.duration} min
                        </span>

                        <span>
                          🔥 {workout.calories} kcal
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(workout._id)}
                      disabled={deletingId === workout._id}
                      className="btn btn-error btn-outline"
                    >
                      {deletingId === workout._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Workouts;