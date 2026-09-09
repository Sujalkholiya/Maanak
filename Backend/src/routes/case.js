const express = require("express");

const {
    getCases,
    getCaseById,
    createCase,
    updateCase,
    updateInspection,
    updateVerification,
    deleteCase,
    getCaseStats,
    getCaseAuditTrail
} = require("../Controllers/case");

const router = express.Router();

router.get("/", getCases); // all
router.get("/stats", getCaseStats); // aggregated stats
router.get("/audit", getCaseAuditTrail); // chronological audit trail
router.get("/:id", getCaseById); // by id or caseId
router.post("/", createCase); // make case
router.put("/:id", updateCase); // update
router.put("/:id/inspection", updateInspection); // update inspection data
router.put("/:id/verification", updateVerification); // update officer decision
router.delete("/:id", deleteCase); // delete

module.exports = router;