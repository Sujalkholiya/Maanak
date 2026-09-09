const userModel = require("../Models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JSON_SECRET || "maanak_secure_secret_key_2026";

// Auto-seed default officer if database is empty
const seedDefaultOfficerIfEmpty = async () => {
    try {
        const count = await userModel.countDocuments();
        if (count === 0) {
            const hash = await bcrypt.hash("Password@123", 10);
            await userModel.create({
                UserName: "officer_vikram",
                Email: "vikram.sharma@maanak.gov.in",
                Password: hash,
                Role: "Officer",
                fullName: "Vikram Sharma",
                officerId: "LM-DL-4029",
                badgeNumber: "BADGE-DL-098",
                department: "Legal Metrology Enforcement Division",
                jurisdiction: "Zone-I HQ, New Delhi"
            });
            console.log("Default Maanak Enforcement Officer (LM-DL-4029) seeded successfully.");
        }
    } catch (e) {
        console.warn("Officer auto-seed skipped:", e.message);
    }
};

setTimeout(seedDefaultOfficerIfEmpty, 2000);

// Helper to build safe user payload
const toUserResponse = (user) => ({
    id: user._id,
    userName: user.UserName,
    email: user.Email,
    role: user.Role || "Officer",
    fullName: user.fullName || user.UserName,
    officerId: user.officerId || "LM-DL-4029",
    badgeNumber: user.badgeNumber || "BADGE-4029",
    department: user.department || "Legal Metrology Enforcement Division",
    jurisdiction: user.jurisdiction || "Zone-I HQ, New Delhi"
});

// POST /api/auth/register
async function registerUser(req, res) {
    try {
        const body = req.body || {};
        const UserName = (body.UserName || body.userName || body.username || "").trim();
        const Email = (body.Email || body.email || "").trim().toLowerCase();
        const Password = body.Password || body.password || "";
        const Role = body.Role || body.role || "Officer";
        const fullName = body.fullName || body.name || UserName;
        const officerId = body.officerId || body.OfficerId || `LM-${Math.floor(1000 + Math.random() * 9000)}`;

        if (!UserName || !Email || !Password) {
            return res.status(400).json({
                success: false,
                message: "Username, email, and password are required."
            });
        }

        const isUserExist = await userModel.findOne({
            $or: [{ UserName }, { Email }]
        });

        if (isUserExist) {
            return res.status(409).json({
                success: false,
                message: "A user with this username or email already exists."
            });
        }

        const hash = await bcrypt.hash(Password, 10);

        const User = await userModel.create({
            UserName,
            Email,
            Password: hash,
            Role,
            fullName,
            officerId,
            badgeNumber: body.badgeNumber || `BG-${officerId}`,
            department: body.department || "Legal Metrology Enforcement Division",
            jurisdiction: body.jurisdiction || "Zone-I HQ, New Delhi"
        });

        const token = jwt.sign(
            { ID: User._id, Role: User.Role, officerId: User.officerId },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("Token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const userPayload = toUserResponse(User);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            token,
            user: userPayload,
            Post: userPayload
        });
    } catch (error) {
        console.error("registerUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
}

// POST /api/auth/login
async function loginUser(req, res) {
    try {
        const body = req.body || {};
        const identifier = (body.UserName || body.userName || body.username || body.officerId || body.OfficerId || body.email || body.Email || "").trim();
        const Password = body.Password || body.password || "";

        if (!identifier || !Password) {
            return res.status(400).json({
                success: false,
                message: "Officer ID / Username / Email and Password are required."
            });
        }

        const User = await userModel.findOne({
            $or: [
                { UserName: identifier },
                { Email: identifier.toLowerCase() },
                { officerId: identifier }
            ]
        });

        if (!User) {
            return res.status(401).json({
                success: false,
                message: "Invalid officer credentials or user not found."
            });
        }

        const isValidPassword = await bcrypt.compare(Password, User.Password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials. Please verify your password."
            });
        }

        const token = jwt.sign(
            { ID: User._id, Role: User.Role, officerId: User.officerId },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("Token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const userPayload = toUserResponse(User);

        return res.status(200).json({
            success: true,
            message: "Officer authentication successful.",
            token,
            user: userPayload,
            Post: userPayload
        });
    } catch (error) {
        console.error("loginUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
}

// GET /api/auth/me
async function getMe(req, res) {
    try {
        const token = req.cookies.Token || (req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authentication token provided"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const User = await userModel.findById(decoded.ID);
        if (!User) {
            return res.status(404).json({
                success: false,
                message: "Officer not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: toUserResponse(User)
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session",
            error: error.message
        });
    }
}

// POST /api/auth/logout
async function logoutUser(req, res) {
    try {
        res.clearCookie("Token");
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    seedDefaultOfficerIfEmpty
};
