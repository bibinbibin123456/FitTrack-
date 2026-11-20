
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChallengCard = ({ challenge, onJoin, joining = false }) => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const userId = user?._id || user?.id || user?.userId;

  const hasJoined = challenge.participants?.some((participant) => {
    const participantId =
      typeof participant === "object"
        ? participant._id || participant.id
        : participant;

    return participantId?.toString() === userId?.toString();
  });

  return (
    <div className="card w-full max-w-sm border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-outline capitalize">
            {challenge.activityType ||
              challenge.challengeType ||
              "Fitness"}
          </span>

          <span className="text-xs text-base-content/60">
            {challenge.participants?.length || 0} participants
          </span>
        </div>

        <h2 className="card-title mt-2">{challenge.title}</h2>

        <p className="text-sm text-base-content/70">
          {challenge.description}
        </p>

        <div className="mt-3 rounded-lg bg-base-200 p-3">
          <p className="text-sm text-base-content/60">
            Challenge target
          </p>

          <p className="text-xl font-bold">
            {challenge.target}{" "}
            <span className="text-sm font-normal capitalize">
              {challenge.challengeType}
            </span>
          </p>
        </div>

        <div className="card-actions mt-4 flex-col">
          <button
            type="button"
            disabled={joining || hasJoined}
            className={`btn w-full border-0 ${
              hasJoined
                ? "bg-base-300 text-base-content"
                : "bg-lime-400 text-gray-950 hover:bg-lime-300"
            } disabled:opacity-70`}
            onClick={() => onJoin && onJoin(challenge._id)}
          >
            {joining
              ? "Joining..."
              : hasJoined
                ? "Already Joined"
                : "Join Challenge"}
          </button>

          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() =>
              navigate(`/leaderboard/${challenge._id}`)
            }
          >
            View Leaderboard
          </button>
          {hasJoined && (
    <button
        type="button"
        className="btn btn-outline btn-success w-full"
        onClick={() =>
            navigate(`/challenge-progress/${challenge._id}`)
        }
    >
        My Progress
    </button>
)}
        </div>
      </div>
    </div>
  );
};

export default ChallengCard;
