
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// ==================== REGISTER USER ====================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log(
            "MongoDB readyState:",
            mongoose.connection.readyState
        );

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// ==================== LOGIN USER ====================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Check whether JWT secret is loaded
        console.log(
            "JWT_SECRET loaded:",
            !!process.env.JWT_SECRET
        );

        // Create JWT Token
        const token = jwt.sign(
            {
                id: user._id.toString(),
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// ==================== GET PROFILE ====================

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user,
        });

    } catch (error) {
        console.error("Profile Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// ==================== EXPORT ====================

module.exports = {
    registerUser,
    loginUser,
    getProfile,
};
