
const ChallengeDb = require("../Models/challengeModel");
const WorkoutDb = require("../Models/workoutModel");
const {
    sanitizeText,
    isValidObjectId,
    parseNumber
} = require("../Utilities/inputValidation");

// Create a challenge
const createChallenge = async (req, res) => {
    try {
        const {
            title,
            description,
            activityType,
            challengeType,
            target,
            startDate,
            endDate
        } = req.body || {};
        const cleanTitle = sanitizeText(title, 100);
        const cleanDescription = sanitizeText(description || "", 500);
        const parsedTarget = parseNumber(target);

        if (
            !cleanTitle ||
            !activityType ||
            !challengeType ||
            parsedTarget === null ||
            !startDate ||
            !endDate
        ) {
            return res.status(400).json({
                error: "All required fields must be provided"
            });
        }

        const allowedActivities = [
            "running",
            "walking",
            "cycling",
            "cardio",
            "workouts"
        ];

        const allowedTypes = [
            "distance",
            "calories",
            "workouts",
            "duration"
        ];

        if (!allowedActivities.includes(activityType)) {
            return res.status(400).json({
                error: "Invalid activity type"
            });
        }

        if (!allowedTypes.includes(challengeType)) {
            return res.status(400).json({
                error: "Invalid challenge type"
            });
        }

        if (parsedTarget <= 0 || parsedTarget > 1000000) {
            return res.status(400).json({
                error: "Target must be a positive number"
            });
        }

        if (
            Number.isNaN(new Date(startDate).getTime()) ||
            Number.isNaN(new Date(endDate).getTime()) ||
            new Date(endDate) <= new Date(startDate)
        ) {
            return res.status(400).json({
                error: "End date must be after start date"
            });
        }

        const challenge = await ChallengeDb.create({
            title: cleanTitle,
            description: cleanDescription,
            activityType,
            challengeType,
            target: parsedTarget,
            startDate,
            endDate,
            createdBy: req.user.id,
            participants: [req.user.id]
        });

        return res.status(201).json({
            message: "Challenge created successfully",
            challenge
        });

    } catch (error) {
        console.log("Create challenge error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


// Get all challenges
const getAllChallenge = async (req, res) => {
    try {
        const challenges = await ChallengeDb.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Challenges fetched successfully",
            challenges
        });

    } catch (error) {
        console.log("Get challenges error:", error);

        return res.status(500).json({
            error: "Server error"
        });
    }
};


// Join a challenge
const joinChallenge = async (req, res) => {
    try {
        const { id } = req.params;

        const challenge = await ChallengeDb.findById(id);

        if (!challenge) {
            return res.status(404).json({
                error: "Challenge not found"
            });
        }

        const userId = req.user.id.toString();

        const alreadyJoined = challenge.participants.some(
            participant => participant.toString() === userId
        );

        if (alreadyJoined) {
            return res.status(400).json({
                error: "You have already joined this challenge"
            });
        }

        const now = new Date();

        if (now > new Date(challenge.endDate)) {
            return res.status(400).json({
                error: "This challenge has already ended"
            });
        }

        challenge.participants.push(req.user.id);

        await challenge.save();

        return res.status(200).json({
            message: "Challenge joined successfully",
            challenge
        });

    } catch (error) {
        console.log("Join challenge error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


// Get a challenge by ID
const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;

        const challenge = await ChallengeDb.findById(id)
            .populate("createdBy", "name email")
            .populate("participants", "name email");

        if (!challenge) {
            return res.status(404).json({
                error: "Challenge not found"
            });
        }

        return res.status(200).json({
            message: "Challenge fetched successfully",
            challenge
        });

    } catch (error) {
        console.log("Get challenge by ID error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


// Get the logged-in user's challenge progress
const getChallengeProgress = async (req, res) => {
    try {
        const { id } = req.params;

        const challenge = await ChallengeDb.findById(id);

        if (!challenge) {
            return res.status(404).json({
                error: "Challenge not found"
            });
        }

        const userId = req.user.id.toString();

        const isParticipant = challenge.participants.some(
            participant => participant.toString() === userId
        );

        if (!isParticipant) {
            return res.status(403).json({
                error: "You have not joined this challenge"
            });
        }

        const now = new Date();

        if (now < new Date(challenge.startDate)) {
            return res.status(200).json({
                message: "Challenge has not started yet",
                challenge: challenge.title,
                activityType: challenge.activityType,
                challengeType: challenge.challengeType,
                target: challenge.target,
                completed: 0,
                progressPercentage: 0,
                status: "upcoming",
                startDate: challenge.startDate,
                endDate: challenge.endDate
            });
        }

        // Find workouts recorded during the challenge period
        const workouts = await WorkoutDb.find({
            userId: req.user.id,
            date: {
                $gte: challenge.startDate,
                $lte: challenge.endDate
            }
        });

        // Only count workouts matching this challenge's activity
        const matchingWorkouts = workouts.filter(workout => {
            if (!workout.workoutType) {
                return false;
            }

            return workout.workoutType.toLowerCase() ===
                challenge.activityType.toLowerCase();
        });

        let completed = 0;

        if (challenge.challengeType === "distance") {
            completed = matchingWorkouts.reduce(
                (total, workout) =>
                    total + Number(workout.distance || 0),
                0
            );
        } else if (challenge.challengeType === "calories") {
            completed = matchingWorkouts.reduce(
                (total, workout) =>
                    total + Number(workout.calories || 0),
                0
            );
        } else if (challenge.challengeType === "workouts") {
            completed = matchingWorkouts.length;
        } else if (challenge.challengeType === "duration") {
            completed = matchingWorkouts.reduce(
                (total, workout) =>
                    total + Number(workout.duration || 0),
                0
            );
        }

        const progressPercentage = Math.min(
            (completed / challenge.target) * 100,
            100
        );

        const status =
            now > new Date(challenge.endDate)
                ? "completed"
                : "active";

        return res.status(200).json({
            message: "Challenge progress fetched successfully",
            challenge: challenge.title,
            activityType: challenge.activityType,
            challengeType: challenge.challengeType,
            target: challenge.target,
            completed,
            progressPercentage: Math.round(progressPercentage),
            status,
            startDate: challenge.startDate,
            endDate: challenge.endDate
        });

    } catch (error) {
        console.log("Challenge progress error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


// Get challenge leaderboard
const getChallengeLeaderboard = async (req, res) => {
    try {
        const { id } = req.params;

        const challenge = await ChallengeDb.findById(id)
            .populate("participants", "name email");

        if (!challenge) {
            return res.status(404).json({
                error: "Challenge not found"
            });
        }

        const leaderboard = [];

        for (const participant of challenge.participants) {
            const workouts = await WorkoutDb.find({
                userId: participant._id,
                date: {
                    $gte: challenge.startDate,
                    $lte: challenge.endDate
                }
            });

            const matchingWorkouts = workouts.filter(workout => {
                return workout.workoutType &&
                    workout.workoutType.toLowerCase() ===
                    challenge.activityType.toLowerCase();
            });

            let completed = 0;

            if (challenge.challengeType === "distance") {
                completed = matchingWorkouts.reduce(
                    (total, workout) =>
                        total + Number(workout.distance || 0),
                    0
                );
            } else if (challenge.challengeType === "calories") {
                completed = matchingWorkouts.reduce(
                    (total, workout) =>
                        total + Number(workout.calories || 0),
                    0
                );
            } else if (challenge.challengeType === "workouts") {
                completed = matchingWorkouts.length;
            } else if (challenge.challengeType === "duration") {
                completed = matchingWorkouts.reduce(
                    (total, workout) =>
                        total + Number(workout.duration || 0),
                    0
                );
            }

            const progressPercentage = Math.min(
                (completed / challenge.target) * 100,
                100
            );

            leaderboard.push({
                userId: participant._id,
                name: participant.name,
                email: participant.email,
                completed,
                progressPercentage: Math.round(progressPercentage)
            });
        }

        leaderboard.sort(
            (a, b) => b.progressPercentage - a.progressPercentage
        );

        leaderboard.forEach((user, index) => {
            user.rank = index + 1;
        });

        return res.status(200).json({
            message: "Challenge leaderboard fetched successfully",
            challenge: challenge.title,
            activityType: challenge.activityType,
            challengeType: challenge.challengeType,
            target: challenge.target,
            leaderboard
        });

    } catch (error) {
        console.log("Challenge leaderboard error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


module.exports = {
    createChallenge,
    getAllChallenge,
    joinChallenge,
    getChallengeById,
    getChallengeProgress,
    getChallengeLeaderboard
};
