const express = require("express");
const authController = require("../Controllers/auth.controller.js");
const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", authController.getMe);
router.post("/logout", authController.logoutUser);

module.exports = router;