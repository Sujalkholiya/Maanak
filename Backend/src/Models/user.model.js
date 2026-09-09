const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        UserName: { type: String, required: true, unique: true },
        Email: { type: String, required: true, unique: true },
        Password: { type: String, required: true },
        Role: {
            type: String,
            enum: ["Officer", "Admin", "Inspector", "User"],
            default: "Officer"
        },
        fullName: { type: String, default: "" },
        officerId: { type: String, default: "" },
        badgeNumber: { type: String, default: "" },
        department: { type: String, default: "Legal Metrology Enforcement Division" },
        jurisdiction: { type: String, default: "Zone-I HQ, New Delhi" }
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel; 