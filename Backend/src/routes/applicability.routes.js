const express = require("express");
const { evaluateApplicability } = require("../Controllers/applicabilityController");

const router = express.Router();

router.post("/evaluate", evaluateApplicability);

module.exports = router;
