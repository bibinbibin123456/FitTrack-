const WorkoutDb = require("../Models/workoutModel");
const {
    sanitizeText,
    isValidObjectId,
    parseNumber
} = require("../Utilities/inputValidation");

const workoutTypes = new Set([
    "Running",
    "Walking",
    "Cycling",
    "Workout",
    "Cardio"
]);

const normalizeWorkout = (body) => {
    const workoutType = sanitizeText(body.workoutType, 40);
    const distance = parseNumber(body.distance);
    const duration = parseNumber(body.duration);
    const calories = parseNumber(body.calories);
    const route = body.route === undefined ? [] : body.route;

    if (
        !workoutTypes.has(workoutType) ||
        distance === null ||
        distance < 0 ||
        duration === null ||
        duration <= 0 ||
        duration > 1440 ||
        calories === null ||
        calories < 0 ||
        calories > 10000
    ) {
        return { error: "Workout type or numeric values are invalid" };
    }

    if (!Array.isArray(route) || route.length > 5000) {
        return { error: "Workout route is invalid or too large" };
    }

    const normalizedRoute = [];
    for (const point of route) {
        const latitude = parseNumber(point?.latitude);
        const longitude = parseNumber(point?.longitude);
        if (
            latitude === null ||
            longitude === null ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return { error: "Workout route contains invalid coordinates" };
        }
        normalizedRoute.push({ latitude, longitude });
    }

    let date;
    if (body.date !== undefined) {
        date = new Date(body.date);
        if (Number.isNaN(date.getTime())) {
            return { error: "Workout date is invalid" };
        }
    }

    const value = {
        workoutType,
        distance,
        duration,
        calories,
        route: normalizedRoute
    };
    if (date) value.date = date;
    return { value };
};

const addworkout = async (req, res) => {
    try {
        const normalized = normalizeWorkout(req.body || {});
        if (normalized.error) {
            return res.status(400).json({ error: normalized.error });
        }

        const workout = new WorkoutDb({
            userId: req.user.id,
            ...normalized.value
        });

        const savedWorkout = await workout.save();

        return res.status(201).json({
            message: "Workout added successfully",
            workout: savedWorkout
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


const getWorkout = async (req, res) => {
    try {
        const workouts = await WorkoutDb.find({
            userId: req.user.id
        }).sort({ date: -1 });

        return res.status(200).json({
            message: "Workouts fetched successfully",
            workouts
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

const updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Workout ID is invalid" });
        }

        const normalized = normalizeWorkout(req.body || {});
        if (normalized.error) {
            return res.status(400).json({ error: normalized.error });
        }

        const workout = await WorkoutDb.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!workout) {
            return res.status(404).json({
                error: "Workout not found"
            });
        }

        Object.assign(workout, normalized.value);

        const updatedWorkout = await workout.save();

        return res.status(200).json({
            message: "Workout updated successfully",
            workout: updatedWorkout
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

const deleteWorkout=async(req,res)=>{
    try {
        const {id}= req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Workout ID is invalid" });
        }
        const workout= await WorkoutDb.findOne({
            _id: id,
            userId: req.user.id
        })
        if(!workout){
            return res.status(404).json({error:"Workout not found"})
        }
        await WorkoutDb.findOneAndDelete({
            _id: id,
            userId: req.user.id
        });
        return res.status(200).json({message:"Workout deleted successfully"})

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Internal server error"
        });
        
    }
}

module.exports = {
    addworkout,
    getWorkout,
    updateWorkout,
    deleteWorkout
};