const express = require("express");
const router = express.Router();

const home = require("../Controllers/home.js");

router.get("/", home.homePage);

module.exports = router;