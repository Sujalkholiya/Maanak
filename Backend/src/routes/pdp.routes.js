const express = require("express");
const { evaluatePdp } = require("../Controllers/pdpController");

const router = express.Router();

router.post("/evaluate", evaluatePdp);

module.exports = router;
