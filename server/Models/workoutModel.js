const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        workoutType: {
            type: String,
            required: true,
            trim: true
        },

        distance: {
            type: Number,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        calories: {
            type: Number,
            required: true
        },

        route: [
            {
                latitude: {
                    type: Number
                },
                longitude: {
                    type: Number
                }
            }
        ],

        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const WorkoutDb = mongoose.model("Workout", workoutSchema);

module.exports = WorkoutDb;