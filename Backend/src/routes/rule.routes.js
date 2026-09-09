const express = require("express");
const { evaluateRules } = require("../Controllers/ruleController");

const router = express.Router();

router.post("/evaluate", evaluateRules);

module.exports = router;
