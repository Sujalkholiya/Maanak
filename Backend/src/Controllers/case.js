const Case = require("../Models/case.js");

const FALLBACK_CASES = [
    {
        _id: "66dc8e4f1a2b3c4d5e6f7a8b",
        caseId: "CASE-2026-0841",
        productName: "Royal Feast Roasted California Almonds (500g)",
        brand: "Royal Feast Organics",
        manufacturer: "ABC Foods Pvt Ltd, Plot 42, Sector 8, IMT Manesar, Gurugram, Haryana - 122050",
        category: "Packaged Food / Dry Fruits",
        batchNo: "RF-2026-B89",
        overallStatus: "POTENTIAL_NON_COMPLIANCE",
        caseStatus: "Potential Non-Compliance",
        priority: "High",
        officer: "Vikram Sharma (Deputy Controller)",
        officerId: "LM-DL-4029",
        location: "Inland Container Depot, Tughlakabad, New Delhi",
        createdDate: "2026-09-08 10:14 IST",
        lastUpdated: "2026-09-08 11:42 IST",
        image: "https://images.unsplash.com/photo-1508061252445-5350f377c130?auto=format&fit=crop&w=1000&q=80",
        findingsCount: {
            compliant: 6,
            potentialNonCompliance: 1,
            needsVerification: 1
        },
        applicability: {
            commodity: "Packaged Food (Dry Fruits)",
            packageType: "Retail Pre-Packaged Pouch",
            isImported: false,
            isInstitutional: false,
            packageCategory: "Standard Retail Commodity",
            applicableRequirementsCount: 8,
            conditionalRequirementsCount: 2,
            potentialExemptionsCount: 0,
            statutoryBasis: "Legal Metrology (Packaged Commodities) Rules, 2011 (Amended 2026.3), Rule 6(1) & Schedule II.",
            rationalePoints: [
                "Classified as non-exempt retail food pre-package under Rule 3 & 6.",
                "Net quantity exceeds 50g threshold; mandatory Unit Sale Price (USP) applies.",
                "Not destined for institutional or industrial consumer.",
                "Domestic manufacture; Country of Origin declaration required."
            ]
        },
        declarations: [
            {
                fieldId: "f1",
                label: "Manufacturer / Packer / Importer",
                hindiLabel: "निर्माता / पैकर का नाम व पता",
                detectedValue: "ABC Foods Pvt Ltd, Plot 42, Sector 8, IMT Manesar, Gurugram, Haryana - 122050",
                confidence: 0.98,
                sourceRegion: "Back Panel · Region 01",
                status: "COMPLIANT",
                ruleId: "RULE-6-1-A",
                isMandatory: true
            },
            {
                fieldId: "f2",
                label: "Generic / Common Name",
                hindiLabel: "वस्तु का सामान्य नाम",
                detectedValue: "Roasted & Salted California Almonds",
                confidence: 0.96,
                sourceRegion: "Front PDP · Top",
                status: "COMPLIANT",
                ruleId: "RULE-6-1-B",
                isMandatory: true
            },
            {
                fieldId: "f3",
                label: "Net Quantity",
                hindiLabel: "शुद्ध मात्रा",
                detectedValue: "500 g",
                confidence: 0.99,
                sourceRegion: "Front PDP · Bottom Right",
                status: "COMPLIANT",
                ruleId: "RULE-6-1-E",
                isMandatory: true
            },
            {
                fieldId: "f4",
                label: "Maximum Retail Price (MRP)",
                hindiLabel: "अधिकतम खुदरा मूल्य",
                detectedValue: "₹ 650.00 (Incl. of all taxes)",
                confidence: 0.94,
                sourceRegion: "Back Panel · Region 02",
                status: "COMPLIANT",
                ruleId: "RULE-6-1-C",
                isMandatory: true
            }
        ],
        rules: [
            {
                ruleId: "RULE-6-1-A",
                requirement: "Name & Address of Manufacturer / Packer",
                legalClause: "Rule 6(1)(a)",
                applicability: "Mandatory",
                validationLogic: "Full address with PIN code verified.",
                effectiveDate: "2026-01-01",
                source: "LM Rules 2011",
                version: "2026.3",
                status: "COMPLIANT",
                evidenceSnippet: "Plot 42, Sector 8, IMT Manesar, Gurugram, Haryana - 122050",
                confidence: 0.98,
                whyExplanation: "Complete physical address and PIN code are present."
            },
            {
                ruleId: "RULE-6-1-B",
                requirement: "Generic / Common Name of Commodity",
                legalClause: "Rule 6(1)(b)",
                applicability: "Mandatory",
                validationLogic: "Generic name declared on Principal Display Panel.",
                effectiveDate: "2026-01-01",
                source: "LM Rules 2011",
                version: "2026.3",
                status: "COMPLIANT",
                evidenceSnippet: "Roasted & Salted California Almonds",
                confidence: 0.96,
                whyExplanation: "Common commodity name is prominently placed on PDP."
            }
        ],
        boundingBoxes: []
    }
];

// Helper to find case by either Mongo ObjectId or caseId string
const findCaseByIdOrCaseId = async (idOrCaseId) => {
    if (!idOrCaseId) return null;
    let found = null;
    try {
        if (idOrCaseId.match(/^[0-9a-fA-F]{24}$/)) {
            found = await Case.findById(idOrCaseId);
        }
    } catch (e) {}
    if (!found) {
        try {
            found = await Case.findOne({ caseId: idOrCaseId });
        } catch (e) {}
    }
    return found;
};

// Helper to ensure safe defaults for older/partial documents
const sanitizeCase = (c) => {
    if (!c) return c;
    const doc = c.toObject ? c.toObject() : { ...c };
    doc.declarations = doc.declarations || [];
    doc.rules = doc.rules || [];
    doc.boundingBoxes = doc.boundingBoxes || [];
    doc.applicability = doc.applicability || {
        commodity: doc.productName || "",
        packageType: "Standard Retail Container",
        isImported: false,
        isInstitutional: false,
        packageCategory: "Standard Retail Commodity",
        applicableRequirementsCount: 7,
        conditionalRequirementsCount: 0,
        potentialExemptionsCount: 0,
        statutoryBasis: "Legal Metrology (Packaged Commodities) Rules, 2011",
        rationalePoints: []
    };
    doc.findingsCount = doc.findingsCount || {
        compliant: doc.rules.filter(r => r.status === 'COMPLIANT').length,
        potentialNonCompliance: doc.rules.filter(r => r.status === 'POTENTIAL_NON_COMPLIANCE').length,
        needsVerification: doc.rules.filter(r => r.status === 'NEEDS_HUMAN_VERIFICATION').length
    };
    return doc;
};

// GET /cases
const getCases = async (req, res) => {
    try {
        let cases = [];
        try {
            cases = await Case.find().sort({ createdAt: -1 });
        } catch (dbErr) {
            console.warn("MongoDB query failed, serving fallback cases:", dbErr.message);
        }

        if (!cases || cases.length === 0) {
            return res.status(200).json(FALLBACK_CASES.map(sanitizeCase));
        }

        const sanitized = cases.map(sanitizeCase);
        res.status(200).json(sanitized);
    } catch (error) {
        console.warn("getCases fallback:", error.message);
        res.status(200).json(FALLBACK_CASES.map(sanitizeCase));
    }
};

// GET /cases/:id
const getCaseById = async (req, res) => {
    try {
        let caseData = null;
        try {
            caseData = await findCaseByIdOrCaseId(req.params.id);
        } catch (e) {}

        if (!caseData) {
            caseData = FALLBACK_CASES.find(c => c.caseId === req.params.id || c.id === req.params.id || c._id === req.params.id);
        }

        if (!caseData) {
            caseData = FALLBACK_CASES[0];
        }

        res.status(200).json(sanitizeCase(caseData));
    } catch (error) {
        console.warn("getCaseById fallback:", error.message);
        res.status(200).json(sanitizeCase(FALLBACK_CASES[0]));
    }
};

// POST /cases
const createCase = async (req, res) => {
    try {
        const payload = { ...req.body };
        if (!payload.caseId) {
            payload.caseId = `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        if (!payload.createdDate) {
            payload.createdDate = new Date().toISOString().replace('T', ' ').substring(0, 19) + " IST";
        }
        const newCase = await Case.create(payload);
        res.status(201).json(sanitizeCase(newCase));
    } catch (error) {
        console.error("createCase error:", error);
        res.status(400).json({
            message: "Failed to create case",
            error: error.message
        });
    }
};

// PUT /cases/:id
const updateCase = async (req, res) => {
    try {
        const existing = await findCaseByIdOrCaseId(req.params.id);
        if (!existing) {
            return res.status(404).json({
                message: "Case not found"
            });
        }

        const updatedCase = await Case.findByIdAndUpdate(
            existing._id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json(sanitizeCase(updatedCase));
    } catch (error) {
        console.error("updateCase error:", error);
        res.status(400).json({
            message: "Failed to update case",
            error: error.message
        });
    }
};

// PUT /cases/:id/inspection
const updateInspection = async (req, res) => {
    try {
        const existing = await findCaseByIdOrCaseId(req.params.id);
        if (!existing) {
            return res.status(404).json({
                message: "Case not found"
            });
        }

        const {
            image,
            declarations,
            applicability,
            rules,
            boundingBoxes,
            findingsCount,
            overallStatus,
            caseStatus = "UNDER_REVIEW",
            ocrMetadata,
            inspectionResults
        } = req.body;

        const updateData = {
            caseStatus,
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) + " IST"
        };

        if (image !== undefined) updateData.image = image;
        if (declarations !== undefined) updateData.declarations = declarations;
        if (applicability !== undefined) updateData.applicability = applicability;
        if (rules !== undefined) updateData.rules = rules;
        if (boundingBoxes !== undefined) updateData.boundingBoxes = boundingBoxes;
        if (findingsCount !== undefined) updateData.findingsCount = findingsCount;
        if (overallStatus !== undefined) updateData.overallStatus = overallStatus;
        if (ocrMetadata !== undefined) updateData.ocrMetadata = ocrMetadata;
        if (inspectionResults !== undefined) updateData.inspectionResults = inspectionResults;

        const updated = await Case.findByIdAndUpdate(
            existing._id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json(sanitizeCase(updated));
    } catch (error) {
        console.error("updateInspection error:", error);
        res.status(500).json({
            message: "Failed to save inspection results",
            error: error.message
        });
    }
};

// PUT /cases/:id/verification
const updateVerification = async (req, res) => {
    try {
        const existing = await findCaseByIdOrCaseId(req.params.id);
        if (!existing) {
            return res.status(404).json({
                message: "Case not found"
            });
        }

        const {
            officerDecision,
            officerNotes,
            caseStatus = "COMPLETED",
            overallStatus
        } = req.body;

        const updateData = {
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) + " IST"
        };

        if (officerDecision !== undefined) updateData.officerDecision = officerDecision;
        if (officerNotes !== undefined) updateData.officerNotes = officerNotes;
        if (caseStatus !== undefined) updateData.caseStatus = caseStatus;
        if (overallStatus !== undefined) updateData.overallStatus = overallStatus;

        const updated = await Case.findByIdAndUpdate(
            existing._id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json(sanitizeCase(updated));
    } catch (error) {
        console.error("updateVerification error:", error);
        res.status(500).json({
            message: "Failed to save human verification",
            error: error.message
        });
    }
};

// DELETE /cases/:id
const deleteCase = async (req, res) => {
    try {
        const existing = await findCaseByIdOrCaseId(req.params.id);
        if (!existing) {
            return res.status(404).json({
                message: "Case not found"
            });
        }

        const deletedCase = await Case.findByIdAndDelete(existing._id);

        res.status(200).json({
            message: "Case deleted successfully",
            case: deletedCase
        });
    } catch (error) {
        console.error("deleteCase error:", error);
        res.status(500).json({
            message: "Failed to delete case"
        });
    }
};

module.exports = {
    getCases,
    getCaseById,
    createCase,
    updateCase,
    updateInspection,
    updateVerification,
    deleteCase
};