const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
    {
        caseId: {
            type: String,
            required: true,
            unique: true
        },

        productName: {
            type: String,
            default: "Packaged Commodity"
        },

        batchNo: {
            type: String,
            default: ""
        },

        manufacturer: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            default: ""
        },

        overallStatus: {
            type: String,
            enum: [
                "POTENTIAL_NON_COMPLIANCE",
                "NEEDS_HUMAN_VERIFICATION",
                "COMPLIANT"
            ],
            default: "NEEDS_HUMAN_VERIFICATION"
        },

        caseStatus: {
            type: String,
            default: "PENDING"
        },

        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Medium"
        },

        officer: {
            type: String,
            default: ""
        },

        officerId: {
            type: String,
            default: ""
        },

        createdDate: {
            type: String,
            default: ""
        },

        brand: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        image: {
            type: String,
            default: ""
        },

        declarations: {
            type: Array,
            default: []
        },

        applicability: {
            type: mongoose.Schema.Types.Mixed,
            default: () => ({
                commodity: "",
                packageType: "",
                isImported: false,
                isInstitutional: false,
                packageCategory: "Standard Retail Commodity",
                applicableRequirementsCount: 0,
                conditionalRequirementsCount: 0,
                potentialExemptionsCount: 0,
                statutoryBasis: "",
                rationalePoints: []
            })
        },

        rules: {
            type: Array,
            default: []
        },

        boundingBoxes: {
            type: Array,
            default: []
        },

        findingsCount: {
            compliant: { type: Number, default: 0 },
            potentialNonCompliance: { type: Number, default: 0 },
            needsVerification: { type: Number, default: 0 }
        },

        officerNotes: {
            type: String,
            default: ""
        },

        officerDecision: {
            type: String,
            enum: [
                "CONFIRMED",
                "REJECTED",
                "RESCAN_REQUESTED",
                "IDLE",
                ""
            ],
            default: "IDLE"
        },

        ocrMetadata: {
            rawText: { type: String, default: "" },
            confidence: { type: Number, default: 0 },
            processedAt: { type: Date, default: Date.now }
        },

        inspectionResults: {
            type: mongoose.Schema.Types.Mixed,
            default: () => ({})
        },

        lastUpdated: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Case", caseSchema);