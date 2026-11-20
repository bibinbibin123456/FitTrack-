
const UserDb = require("../Models/userModel");

const { createToken } = require("../Utilities/generateToken");

const {
    hashPassword,
    comparePassword
} = require("../Utilities/passwordUtilities");

const {
    sanitizeText,
    normalizeEmail,
    isValidEmail,
    isValidIndianPhone,
    isStrongPassword
} = require("../Utilities/inputValidation");


// Authentication cookie settings
const authCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000,
    path: "/"
};


// REGISTER
const register = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            confirmpassword
        } = req.body || {};

        const cleanName = sanitizeText(name, 80);
        const cleanEmail = normalizeEmail(email);
        const cleanPhone = sanitizeText(phone, 20);

        if (!cleanName) {
            return res.status(400).json({
                error: "Enter a valid name"
            });
        }

        if (!isValidEmail(cleanEmail)) {
            return res.status(400).json({
                error: "Enter a valid email address"
            });
        }

        if (!isValidIndianPhone(cleanPhone)) {
            return res.status(400).json({
                error: "Enter a valid 10-digit Indian mobile number"
            });
        }

        if (
            typeof password !== "string" ||
            typeof confirmpassword !== "string"
        ) {
            return res.status(400).json({
                error: "Enter a valid password"
            });
        }

        if (Buffer.byteLength(password, "utf8") < 8) {
            return res.status(400).json({
                error: "Password must contain at least 8 characters"
            });
        }

        if (Buffer.byteLength(password, "utf8") > 72) {
            return res.status(400).json({
                error: "Password is too long"
            });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({
                error: "Password must include uppercase, lowercase, number and symbol"
            });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({
                error: "Passwords do not match"
            });
        }

        const userExist = await UserDb.findOne({
            email: cleanEmail
        });

        if (userExist) {
            return res.status(409).json({
                error: "Email already exists"
            });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new UserDb({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            password: hashedPassword
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
        console.error("Registration error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        const cleanEmail = normalizeEmail(email);

        if (
            !isValidEmail(cleanEmail) ||
            typeof password !== "string" ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        const userExist = await UserDb.findOne({
            email: cleanEmail
        });

        console.log("Login - User found:", !!userExist);

        if (!userExist) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const passwordMatch = await comparePassword(
            password,
            userExist.password
        );

        console.log("Login - Password matched:", passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = createToken(userExist._id);

        const user = {
            _id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            phone: userExist.phone
        };

        res.cookie("token", token, authCookieOptions);

        return res.status(200).json({
            message: "User login successfully",
            user
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


// GET PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await UserDb.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            error: "Failed to fetch profile"
        });
    }
};


// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body || {};

        const cleanName = sanitizeText(name, 80);
        const cleanPhone = sanitizeText(phone, 20);

        if (!cleanName) {
            return res.status(400).json({
                error: "Enter a valid name"
            });
        }

        if (!isValidIndianPhone(cleanPhone)) {
            return res.status(400).json({
                error: "Enter a valid 10-digit Indian mobile number"
            });
        }

        const user = await UserDb.findByIdAndUpdate(
            req.user.id,
            {
                name: cleanName,
                phone: cleanPhone
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            error: "Failed to update profile"
        });
    }
};


// LOGOUT
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });

    return res.status(200).json({
        message: "Logged out successfully"
    });
};


// EXPORT CONTROLLERS
module.exports = {
    register,
    login,
    logout,
    getProfile,
    updateProfile
};
