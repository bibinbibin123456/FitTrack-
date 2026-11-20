const AdminDb = require("../Models/adminModel");
const bcrypt = require("bcryptjs");
const { createToken } = require("../Utilities/generateToken");
const UserDb = require("../Models/userModel");
const ChallengeDb = require("../Models/challengeModel");
const WorkoutDb = require("../Models/workoutModel");
const FoodDb = require("../Models/foodModel");
const crypto = require("crypto");
const {
    normalizeEmail,
    isValidEmail
} = require("../Utilities/inputValidation");

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
    path: "/"
};

// Admin Register
const adminRegister = async (req, res) => {
    try {
        const { email, password, confirmpassword } = req.body || {};
        const setupKey = req.get("x-admin-setup-key");
        const expectedKey = process.env.ADMIN_SETUP_KEY;
        const providedKeyBuffer = Buffer.from(setupKey || "");
        const expectedKeyBuffer = Buffer.from(expectedKey || "");

        if (
            !expectedKey ||
            providedKeyBuffer.length !== expectedKeyBuffer.length ||
            !crypto.timingSafeEqual(providedKeyBuffer, expectedKeyBuffer)
        ) {
            return res.status(404).json({ error: "Not found" });
        }

        const cleanEmail = normalizeEmail(email);
        if (
            !isValidEmail(cleanEmail) ||
            typeof password !== "string" ||
            typeof confirmpassword !== "string" ||
            Buffer.byteLength(password, "utf8") < 12 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                error: "Enter a valid email and a password between 12 and 72 bytes"
            });
        }

        // Check password
        if (password !== confirmpassword) {
            return res.status(400).json({
                error: "Passwords do not match"
            });
        }

        // Check existing admin
        const adminExist = await AdminDb.findOne({ email: cleanEmail });

        if (adminExist) {
            return res.status(409).json({
                error: "Admin email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const newAdmin = new AdminDb({
            email: cleanEmail,
            password: hashedPassword
        });

        const savedAdmin = await newAdmin.save();

        if (savedAdmin) {
            return res.status(201).json({
                message: "Admin registered successfully"
            });
        }

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message || "Internal server error"
        });
    }
};


// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const cleanEmail = normalizeEmail(email);

        if (!isValidEmail(cleanEmail) || typeof password !== "string" || password.length > 72) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const admin = await AdminDb.findOne({ email: cleanEmail });

        if (!admin) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = createToken(admin._id, "admin");

        res.cookie("token", token, authCookieOptions);

        return res.status(200).json({
            message: "Admin login successful",
            admin: {
                id: admin._id,
                email: admin.email
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message || "Internal server error"
        });
    }
};

const getDashboard = async (req, res) => {
  try {
    const [users, challenges, workouts, foodEntries] = await Promise.all([
      UserDb.countDocuments(),
      ChallengeDb.countDocuments(),
      WorkoutDb.countDocuments(),
      FoodDb.countDocuments(),
    ]);

    return res.status(200).json({
      stats: { users, challenges, workouts, foodEntries },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ error: "Failed to load admin dashboard" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await UserDb.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Admin users error:", error);
    return res.status(500).json({ error: "Failed to load users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await UserDb.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Promise.all([
      WorkoutDb.deleteMany({ userId: req.params.id }),
      FoodDb.deleteMany({ userId: req.params.id }),
    ]);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};

const getChallenges = async (req, res) => {
  try {
    const challenges = await ChallengeDb.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json({ challenges });
  } catch (error) {
    console.error("Admin challenges error:", error);
    return res.status(500).json({ error: "Failed to load challenges" });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const challenge = await ChallengeDb.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }
    return res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (error) {
    console.error("Delete challenge error:", error);
    return res.status(500).json({ error: "Failed to delete challenge" });
  }
};

module.exports = {
    adminRegister,
    adminLogin,
    getDashboard,
    getUsers,
    deleteUser,
    getChallenges,
    deleteChallenge
};