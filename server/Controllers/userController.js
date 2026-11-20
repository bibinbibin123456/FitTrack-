const UserDb = require("../Models/userModel");
const { createToken } = require("../Utilities/generateToken");
const { hashPassword, comparePassword } = require("../Utilities/passwordUtilities");
const {
    sanitizeText,
    normalizeEmail,
    isValidEmail,
    isValidPhone,
    isValidIndianPhone,
    isStrongPassword,
    parseNumber,
    isValidOptionalMeasurement
} = require("../Utilities/inputValidation");

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
    path: "/"
};

const register = async (req, res) => {
    try {
        const { name, email, phone, password, confirmpassword } = req.body || {};
        const cleanName = sanitizeText(name, 80);
        const cleanEmail = normalizeEmail(email);
        const cleanPhone = sanitizeText(phone, 20);

        if (!cleanName) {
            return res.status(400).json({ error: "Enter a valid name" });
        }

        if (!isValidEmail(cleanEmail)) {
            return res.status(400).json({ error: "Enter a valid email address" });
        }

        if (!isValidIndianPhone(cleanPhone)) {
            return res.status(400).json({
                error: "Enter a 10-digit Indian mobile number starting with 6-9, optionally prefixed with +91"
            });
        }

        if (typeof password !== "string" || typeof confirmpassword !== "string") {
            return res.status(400).json({ error: "Enter a valid password" });
        }

        if (Buffer.byteLength(password, "utf8") < 8) {
            return res.status(400).json({
                error: "Please use a password with at least 8 characters"
            });
        }

        if (Buffer.byteLength(password, "utf8") > 72) {
            return res.status(400).json({
                error: "Your password is too long. Please shorten it"
            });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({
                error: "Please include a capital letter, a small letter, a number, and a symbol in your password"
            });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({
                error: "Passwords do not match"
            });
        }

        const userExist = await UserDb.findOne({ email: cleanEmail });

        if (userExist) {
            return res.status(409).json({
                error: "Email already exists"
            });
        }

        const hashedPassword= await hashPassword(password)
        const newUser = new UserDb({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            password:hashedPassword
        });

        const saved = await newUser.save();
        const token = createToken(saved._id);
        res.cookie("token", token, authCookieOptions);

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: saved._id,
                name: saved.name,
                email: saved.email,
                phone: saved.phone
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message || "Internal server error"
        });
    }
};

const login = async(req,res)=>{
    try {
        const { email, password } = req.body || {};
        const cleanEmail = normalizeEmail(email);
        if (!isValidEmail(cleanEmail) || typeof password !== "string" || password.length > 72) {
            return res.status(400).json({error:"All fields are required"})
        }
        const userExit= await UserDb.findOne({ email: cleanEmail })
        if(!userExit){
            return res.status(401).json({error:"Invalid email or password"})
        }

        const passwordMatch= await comparePassword(password,userExit.password)
        if(!passwordMatch){
            return res.status(401).json({error:"Invalid email or password"})
        }
         const token= createToken(userExit._id)
         const user = {
             _id: userExit._id,
             name: userExit.name,
             email: userExit.email,
             phone: userExit.phone
         }
       
        res.cookie("token", token, authCookieOptions)
        return res.status(200).json({
            message:"User login successfully",
            user
        })

    } catch (error) {
                console.log(error);

        return res.status(500).json({
            error: error.message || "Internal server error"
        });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await UserDb.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
};

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });
    return res.status(200).json({ message: "Logged out successfully" });
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone, weightKg: rawWeightKg, heightCm: rawHeightCm, gender } = req.body || {};
        const cleanName = sanitizeText(name, 80);
        const cleanPhone = sanitizeText(phone, 20);
        const cleanGender = typeof gender === "string" ? gender.trim() : "";
        const validGenders = ["", "male", "female", "other", "prefer_not_to_say"];

        if (!cleanName || !isValidPhone(cleanPhone)) {
            return res.status(400).json({ error: "Enter a valid name and phone number" });
        }

        if (
            !isValidOptionalMeasurement(rawWeightKg, 20, 300) ||
            !isValidOptionalMeasurement(rawHeightCm, 100, 250)
        ) {
            return res.status(400).json({
                error: "Enter a weight between 20 and 300 kg and a height between 100 and 250 cm"
            });
        }

        if (
            (gender !== undefined && gender !== null && typeof gender !== "string") ||
            !validGenders.includes(cleanGender)
        ) {
            return res.status(400).json({ error: "Choose a valid gender option" });
        }

        const updates = { name: cleanName, phone: cleanPhone };
        if (rawWeightKg !== undefined) {
            updates.weightKg = rawWeightKg === null || rawWeightKg === ""
                ? null
                : parseNumber(rawWeightKg);
        }
        if (rawHeightCm !== undefined) {
            updates.heightCm = rawHeightCm === null || rawHeightCm === ""
                ? null
                : parseNumber(rawHeightCm);
        }
        if (gender !== undefined) {
            updates.gender = cleanGender;
        }

        const user = await UserDb.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({ error: "Failed to update profile" });
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile,
    updateProfile
};