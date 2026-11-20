import React from "react";

const WorkoutCard = ({ workout }) => {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{workout.workoutType}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-base-content/60">Distance</p>
            <p className="font-semibold">{workout.distance} km</p>
          </div>

          <div>
            <p className="text-sm text-base-content/60">Duration</p>
            <p className="font-semibold">{workout.duration} min</p>
          </div>

          <div>
            <p className="text-sm text-base-content/60">Calories Burned</p>
            <p className="font-semibold">{workout.calories} kcal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;