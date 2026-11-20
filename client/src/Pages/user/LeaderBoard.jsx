
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChallengeLeaderboard } from "../../services/userServices";

const Leaderboard = () => {
    const { id } = useParams();

    const [leaderboard, setLeaderboard] = useState([]);
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getChallengeLeaderboard(id);

                setLeaderboard(response.data.leaderboard || []);
                setChallenge(response.data);
            } catch (error) {
                console.log("Leaderboard error:", error);

                setError(
                    error.response?.data?.error ||
                    "Failed to load leaderboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [id]);

    // Progress unit based on challenge type
    const progressUnit = {
        calories: "calories",
        distance: "km",
        duration: "minutes",
        workouts: "workouts",
    }[challenge?.challengeType] || "";

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-lime-400"></span>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-error font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 sm:p-6">
            <div className="mx-auto max-w-4xl">

                {/* Page heading */}
                <h1 className="text-3xl font-bold mb-2">
                    Leaderboard
                </h1>

                {/* Challenge information */}
                {challenge && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold capitalize">
                            {challenge.challenge}
                        </h2>

                        <p className="text-sm opacity-70 mt-1">
                            Activity: {challenge.activityType}
                        </p>

                        <p className="text-sm opacity-70">
                            Target: {challenge.target} {progressUnit}
                        </p>
                    </div>
                )}

                {/* Leaderboard list */}
                <div className="bg-base-100 rounded-xl shadow-md overflow-hidden">

                    {leaderboard.length === 0 ? (
                        <p className="p-6 text-center opacity-70">
                            No participants yet.
                        </p>
                    ) : (
                        leaderboard.map((user) => (
                            <div
                                key={user.userId}
                                className="flex flex-col gap-4 border-b border-base-300 p-4 last:border-none sm:flex-row sm:items-center sm:justify-between sm:p-5"
                            >

                                {/* User information */}
                                <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                    {/* Rank badge */}
                                    <span
                                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg
                                            ${
                                                user.rank === 1
                                                    ? "bg-yellow-400 text-black"
                                                    : user.rank === 2
                                                    ? "bg-gray-300 text-black"
                                                    : user.rank === 3
                                                    ? "bg-orange-400 text-black"
                                                    : "bg-base-300 text-base-content"
                                            }`}
                                    >
                                        {user.rank}
                                    </span>

                                    <div className="min-w-0">
                                        <h3 className="font-semibold">
                                            <span className="break-words">{user.name}</span>
                                        </h3>

                                        <p className="break-all text-xs opacity-60">
                                            {user.email}
                                        </p>

                                        <p className="text-sm opacity-70 mt-1">
                                            {user.completed} {progressUnit}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress information */}
                                <div className="flex items-center justify-between gap-3 sm:min-w-28 sm:flex-col sm:items-end">

                                    <p className="font-bold mb-2">
                                        {user.progressPercentage}%
                                    </p>

                                    <progress
                                        className="progress progress-success w-28 max-w-full"
                                        value={user.progressPercentage}
                                        max="100"
                                    />

                                </div>

                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
};

export default Leaderboard;
