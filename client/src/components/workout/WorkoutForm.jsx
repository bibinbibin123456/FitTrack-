import React, { useState } from "react";
import { Button } from "../common/Button";

const WorkoutForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    workoutType: "Running",
    distance: "",
    duration: "",
    calories: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Add Workout</h2>
        <p className="mt-1 text-sm text-base-content/60">
          Record your activity and track your progress.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Workout Type
          </label>
          <select
            name="workoutType"
            value={formData.workoutType}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="Running">Running</option>
            <option value="Walking">Walking</option>
            <option value="Cycling">Cycling</option>
            <option value="Cardio">Cardio</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Distance (km)
          </label>
          <input
            type="number"
            name="distance"
            placeholder="e.g. 5.4"
            value={formData.distance}
            onChange={handleChange}
            className="input input-bordered w-full"
            min="0"
            step="any"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            placeholder="e.g. 32"
            value={formData.duration}
            onChange={handleChange}
            className="input input-bordered w-full"
            min="1"
            step="1"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Calories Burned (kcal)
          </label>
          <input
            type="number"
            name="calories"
            placeholder="e.g. 380"
            value={formData.calories}
            onChange={handleChange}
            className="input input-bordered w-full"
            min="0"
            step="1"
            required
          />
        </div>

      <Button type="submit">
        Save Workout
      </Button>
      </div>
    </form>
  );
};

export default WorkoutForm;