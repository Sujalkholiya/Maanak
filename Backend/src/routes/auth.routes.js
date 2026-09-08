const express = require("express");
const authController = require("../Controllers/auth.controller.js");
const router = express.Router();

router.post("/register",authController.registerUser);

router.post("/login",authController.loginUser);

module.exports = router;