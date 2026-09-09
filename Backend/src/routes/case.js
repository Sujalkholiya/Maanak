const express = require("express");

const {
    getCases,
    getCaseById,
    createCase,
    updateCase,
    updateInspection,
    updateVerification,
    deleteCase
} = require("../Controllers/case");

const router = express.Router();

router.get("/", getCases); // all
router.get("/:id", getCaseById); // by id or caseId
router.post("/", createCase); // make case
router.put("/:id", updateCase); // update
router.put("/:id/inspection", updateInspection); // update inspection data
router.put("/:id/verification", updateVerification); // update officer decision
router.delete("/:id", deleteCase); // delete

module.exports = router;