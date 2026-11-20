
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChallengeProgress } from "../../services/userServices";

const ChallengeProgress = () => {
    const { id } = useParams();

    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getChallengeProgress(id);
                setProgress(response.data);
            } catch (error) {
                console.log("Challenge progress error:", error);

                setError(
                    error.response?.data?.error ||
                    "Failed to fetch challenge progress"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [id]);

    const progressUnit = {
        calories: "calories",
        distance: "km",
        duration: "minutes",
        workouts: "workouts",
    }[progress?.challengeType] || "";

    const completed = progress?.completed || 0;
    const target = progress?.target || 0;
    const remaining = Math.max(target - completed, 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-lime-400"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-error">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 sm:p-6">
            <div className="mx-auto max-w-3xl">

                <h1 className="text-3xl font-bold mb-6">
                    My Challenge Progress
                </h1>

                <div className="bg-base-100 rounded-xl shadow-md p-6">

                    <h2 className="text-2xl font-bold capitalize">
                        {progress.challenge}
                    </h2>

                    <p className="text-sm opacity-70 mt-2 capitalize">
                        {progress.activityType} Challenge
                    </p>

                    <div className="mt-5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">
                                Your Progress
                            </span>

                            <span className="text-xl font-bold text-lime-400">
                                {progress.progressPercentage}%
                            </span>
                        </div>

                        <progress
                            className="progress progress-success w-full h-4"
                            value={progress.progressPercentage}
                            max="100"
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div className="bg-base-200 rounded-lg p-4">
                            <p className="text-sm opacity-70">
                                Completed
                            </p>

                            <p className="mt-1 break-words text-xl font-bold">
                                {completed} {progressUnit}
                            </p>
                        </div>

                        <div className="bg-base-200 rounded-lg p-4">
                            <p className="text-sm opacity-70">
                                Target
                            </p>

                            <p className="mt-1 break-words text-xl font-bold">
                                {target} {progressUnit}
                            </p>
                        </div>

                        <div className="bg-base-200 rounded-lg p-4">
                            <p className="text-sm opacity-70">
                                Remaining
                            </p>

                            <p className="mt-1 break-words text-xl font-bold">
                                {remaining} {progressUnit}
                            </p>
                        </div>

                        <div className="bg-base-200 rounded-lg p-4">
                            <p className="text-sm opacity-70">
                                Status
                            </p>

                            <p className="mt-1 break-words text-xl font-bold capitalize">
                                {progress.status}
                            </p>
                        </div>

                    </div>

                    <div className="mt-6 text-sm opacity-70">
                        <p>
                            Start: {new Date(progress.startDate).toLocaleDateString()}
                        </p>

                        <p>
                            End: {new Date(progress.endDate).toLocaleDateString()}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChallengeProgress;
