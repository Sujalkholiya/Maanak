const express = require("express");
const { evaluateRules, getRuleLibrary } = require("../Controllers/ruleController");

const router = express.Router();

router.get("/", getRuleLibrary);
router.get("/library", getRuleLibrary);
router.post("/evaluate", evaluateRules);

module.exports = router;
