
const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // The activity participants will perform
    activityType: {
      type: String,
      enum: [
        "running",
        "walking",
        "cycling",
        "cardio",
        "workouts",
      ],
      default: "workouts",
      required: true,
    },

    // How progress is measured
    challengeType: {
      type: String,
      enum: ["distance", "calories", "workouts", "duration"],
      required: true,
    },

    target: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ChallengeDb = mongoose.model("Challenge", challengeSchema);

module.exports = ChallengeDb;
