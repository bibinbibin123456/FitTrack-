
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllChallenges,
  joinChallenge,
} from "../../services/userServices";

import ChallengCard from "../../components/challenge/ChallengCard";
import Loading from "../../components/common/Loading";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningId, setJoiningId] = useState(null);

  // Fetch all challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setError("");

        const response = await getAllChallenges();
        const data =
          response.data?.challenges ?? response.data;

        setChallenges(Array.isArray(data) ? data : []);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load challenges. Please try again.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Join a challenge
  const handleJoin = async (id) => {
    if (!id || joiningId) return;

    setJoiningId(id);

    try {
      const response = await joinChallenge(id);

      toast.success(
        response.data?.message ||
          "Successfully joined the challenge!"
      );

      setChallenges((current) =>
        current.map((challenge) =>
          challenge._id === id
            ? response.data?.challenge || {
                ...challenge,
                participants: [
                  ...(challenge.participants || []),
                  response.data?.userId,
                ].filter(Boolean),
              }
            : challenge
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to join the challenge."
      );
    } finally {
      setJoiningId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 text-base-content">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 text-base-content transition-colors duration-300 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-lime-500">
            FitTrack
          </p>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Fitness Challenges
          </h1>

          <p className="mt-2 text-base-content/70">
            Join a challenge, track your progress, and reach your goals.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="alert alert-error mb-6"
          >
            <span>{error}</span>

            <button
              type="button"
              className="btn btn-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && challenges.length === 0 && (
          <div className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold">
              No challenges yet
            </h2>

            <p className="mt-2 text-base-content/70">
              Create a fitness challenge and start working toward your goals.
            </p>
          </div>
        )}

        {/* Challenge cards */}
        {challenges.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <ChallengCard
                key={challenge._id}
                challenge={challenge}
                onJoin={handleJoin}
                joining={joiningId === challenge._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;
