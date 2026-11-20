
import React, { useState } from "react";
import { toast } from "react-toastify";
import { createChallenge } from "../../services/userServices";
import { Button } from "../../components/common/Button";

const CreateChallenge = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    activityType: "running",
    challengeType: "distance",
    target: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit the challenge
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      !formData.title.trim() ||
      !formData.activityType ||
      !formData.challengeType ||
      formData.target === "" ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.target)) ||
      Number(formData.target) <= 0
    ) {
      toast.error("Target must be greater than zero.");
      return;
    }

    if (
      Number.isNaN(new Date(formData.startDate).getTime()) ||
      Number.isNaN(new Date(formData.endDate).getTime()) ||
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      toast.error("End date must be after start date.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      activityType: formData.activityType,
      challengeType: formData.challengeType,
      target: Number(formData.target),
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    setLoading(true);

    try {
      // Temporary debugging: check the data being sent
      console.log("Challenge payload:", payload);

      const response = await createChallenge(payload);

      toast.success(
        response.data?.message || "Challenge created successfully!"
      );

      // Reset form after successful creation
      setFormData({
        title: "",
        description: "",
        activityType: "running",
        challengeType: "distance",
        target: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error(
        "Create challenge error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to create challenge."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Page heading */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-lime-500">
            FitTrack
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Create a Challenge
          </h1>

          <p className="mt-2 text-base-content/70">
            Set a goal, stay consistent, and challenge yourself and others.
          </p>
        </div>

        {/* Challenge form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8"
        >
          {/* Challenge title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block font-medium"
            >
              Challenge Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 30-Day Running Challenge"
              className="input input-bordered w-full"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your challenge and its goals..."
              className="textarea textarea-bordered w-full"
              rows={4}
            />
          </div>

          {/* Activity type */}
          <div>
            <label
              htmlFor="activityType"
              className="mb-2 block font-medium"
            >
              Activity Type
            </label>

            <select
              id="activityType"
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="running">Running</option>
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
              <option value="cardio">Cardio</option>
              <option value="workouts">General Workouts</option>
            </select>
          </div>

          {/* Progress type */}
          <div>
            <label
              htmlFor="challengeType"
              className="mb-2 block font-medium"
            >
              Progress Type
            </label>

            <select
              id="challengeType"
              name="challengeType"
              value={formData.challengeType}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="distance">Distance (km)</option>
              <option value="calories">Calories burned</option>
              <option value="workouts">Number of workouts</option>
              <option value="duration">Duration (minutes)</option>
            </select>
          </div>

          {/* Target */}
          <div>
            <label
              htmlFor="target"
              className="mb-2 block font-medium"
            >
              Target
            </label>

            <input
              id="target"
              type="number"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="e.g. 50"
              min="1"
              step="any"
              className="input input-bordered w-full"
              required
            />

            <p className="mt-1 text-sm text-base-content/60">
              Enter the total goal for this challenge.
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block font-medium"
              >
                Start Date
              </label>

              <input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                max={formData.endDate || undefined}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block font-medium"
              >
                End Date
              </label>

              <input
                id="endDate"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || undefined}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Challenge..." : "Create Challenge"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChallenge;
