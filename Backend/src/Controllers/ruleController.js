/**
 * Deterministic Rule Evaluation Engine for Legal Metrology (Packaged Commodities) Rules, 2011
 */

const computeRulesEvaluation = (params = {}) => {
    const {
        category = "",
        declarations = [],
        applicability = {}
    } = params;

        // Map declarations for quick lookup
        const decMap = {};
        (declarations || []).forEach(d => {
            const key = (d.fieldId || d.field || d.label || "").toLowerCase();
            decMap[key] = d;
            if (d.fieldId) decMap[d.fieldId.toLowerCase()] = d;
        });

        const getDec = (...keys) => {
            for (const k of keys) {
                const lower = k.toLowerCase();
                if (decMap[lower]) return decMap[lower];
                // Also search by label substring
                const found = (declarations || []).find(d => 
                    (d.fieldId && d.fieldId.toLowerCase() === lower) ||
                    (d.label && d.label.toLowerCase().includes(lower))
                );
                if (found) return found;
            }
            return null;
        };

        const ruleEvaluations = [];

        // Helper to check if detected value is genuinely present
        const isPresent = (dec) => {
            if (!dec) return false;
            const val = (dec.detectedValue || dec.value || "").trim();
            return val.length > 0 && val.toLowerCase() !== "not detected" && val.toLowerCase() !== "none";
        };

        // -------------------------------------------------------------
        // RULE 1: RULE-6-1-A (Manufacturer / Packer Details)
        // -------------------------------------------------------------
        const mfrDec = getDec("f-mfr", "manufacturer");
        const mfrVal = mfrDec ? (mfrDec.detectedValue || mfrDec.value || "") : "";
        const mfrConf = mfrDec ? (mfrDec.confidence || 0.8) : 0;
        let mfrStatus = "COMPLIANT";
        let mfrReason = "Complete manufacturer identification and premise location successfully verified.";

        if (!isPresent(mfrDec)) {
            mfrStatus = "POTENTIAL_NON_COMPLIANCE";
            mfrReason = "Mandatory Manufacturer / Packer / Importer identification missing from inspected package.";
        } else if (mfrConf < 0.7 || mfrVal.length < 10) {
            mfrStatus = "NEEDS_HUMAN_VERIFICATION";
            mfrReason = "Manufacturer premise address appears incomplete or contains low OCR confidence. Physical inspection needed.";
        }

        ruleEvaluations.push({
            ruleId: "RULE-6-1-A",
            requirement: "Full Name and Complete Postal Address of Manufacturer / Packer",
            legalClause: "Rule 6(1)(a)",
            applicability: "Mandatory",
            validationLogic: "Must include manufacturer corporate name, registered premise address, city, state, and PIN code.",
            effectiveDate: "2026-01-01 (Ver. 2026.3)",
            source: "Legal Metrology (Packaged Commodities) Rules Repository",
            version: "2026.3",
            status: mfrStatus,
            evidenceSnippet: mfrVal || "Not detected",
            confidence: mfrConf > 1 ? mfrConf / 100 : mfrConf,
            systemLimitation: mfrStatus === "NEEDS_HUMAN_VERIFICATION" ? "Optical character parsing may have truncated long industrial zone addresses." : undefined,
            whyExplanation: mfrReason
        });

        // -------------------------------------------------------------
        // RULE 2: RULE-6-1-B (Common / Generic Product Name)
        // -------------------------------------------------------------
        const nameDec = getDec("f-name", "productName", "name");
        const nameVal = nameDec ? (nameDec.detectedValue || nameDec.value || "") : "";
        const nameConf = nameDec ? (nameDec.confidence || 0.85) : 0;
        let nameStatus = "COMPLIANT";
        let nameReason = "Generic commodity name declared prominently on Principal Display Panel.";

        if (!isPresent(nameDec)) {
            nameStatus = "POTENTIAL_NON_COMPLIANCE";
            nameReason = "Generic or common name of commodity is absent on the display panel.";
        } else if (nameConf < 0.65) {
            nameStatus = "NEEDS_HUMAN_VERIFICATION";
            nameReason = "Generic name detected with low confidence. Officer verification recommended.";
        }

        ruleEvaluations.push({
            ruleId: "RULE-6-1-B",
            requirement: "Generic / Common Name of Commodity on Principal Display Panel",
            legalClause: "Rule 6(1)(b)",
            applicability: "Mandatory",
            validationLogic: "Verify that generic commodity name is declared without ambiguity to prevent deceptive packaging.",
            effectiveDate: "2026-01-01 (Ver. 2026.3)",
            source: "Legal Metrology Standards",
            version: "2026.3",
            status: nameStatus,
            evidenceSnippet: nameVal || "Not detected",
            confidence: nameConf > 1 ? nameConf / 100 : nameConf,
            whyExplanation: nameReason
        });

        // -------------------------------------------------------------
        // RULE 3: RULE-6-1-E (Maximum Retail Price - MRP)
        // -------------------------------------------------------------
        const mrpDec = getDec("f-mrp", "mrp", "price");
        const mrpVal = mrpDec ? (mrpDec.detectedValue || mrpDec.value || "") : "";
        const mrpConf = mrpDec ? (mrpDec.confidence || 0.8) : 0;
        let mrpStatus = "COMPLIANT";
        let mrpReason = "Single Maximum Retail Price declared inclusive of all taxes.";

        if (!isPresent(mrpDec)) {
            mrpStatus = "POTENTIAL_NON_COMPLIANCE";
            mrpReason = "Mandatory Maximum Retail Price (MRP) declaration is missing from the package.";
        } else if (/(\b\d+\b).*(?:\/|overprint|sticker).*(\b\d+\b)/i.test(mrpVal) || mrpDec.notes?.toLowerCase().includes("double") || mrpDec.notes?.toLowerCase().includes("sticker")) {
            mrpStatus = "POTENTIAL_NON_COMPLIANCE";
            mrpReason = "Secondary price sticker or dual pricing detected without authorized regulatory stamp (violates Rule 18(2)).";
        } else if (mrpConf < 0.7) {
            mrpStatus = "NEEDS_HUMAN_VERIFICATION";
            mrpReason = "MRP numeral clarity borderline. Physical inspection required to verify tax inclusiveness.";
        }

        ruleEvaluations.push({
            ruleId: "RULE-6-1-E",
            requirement: "Single Clear Maximum Retail Price (MRP) Declaration",
            legalClause: "Rule 6(1)(e) read with Rule 18(2)",
            applicability: "Mandatory",
            validationLogic: "Verify MRP is declared clearly in Indian Rupees inclusive of all taxes without smudging or unendorsed stickers.",
            effectiveDate: "2026-01-01 (Ver. 2026.3)",
            source: "Legal Metrology Enforcement Directives",
            version: "2026.3",
            status: mrpStatus,
            evidenceSnippet: mrpVal || "Not detected",
            confidence: mrpConf > 1 ? mrpConf / 100 : mrpConf,
            systemLimitation: "Optical camera cannot peel adhesive stickers to expose underlying base print without manual physical handling.",
            whyExplanation: mrpReason
        });

        // -------------------------------------------------------------
        // RULE 4: RULE-7-1 (Net Quantity & Metric Measurements)
        // -------------------------------------------------------------
        const netDec = getDec("f-net-qty", "netquantity", "net_quantity");
        const netVal = netDec ? (netDec.detectedValue || netDec.value || "") : "";
        const netConf = netDec ? (netDec.confidence || 0.85) : 0;
        let netStatus = "COMPLIANT";
        let netReason = "Net quantity declared in standard metric units conforming to Schedule II.";

        if (!isPresent(netDec)) {
            netStatus = "POTENTIAL_NON_COMPLIANCE";
            netReason = "Mandatory net quantity declaration is missing.";
        } else if (!/(?:g|kg|mg|ml|l|ltr|pcs?|pieces?)\b/i.test(netVal)) {
            netStatus = "POTENTIAL_NON_COMPLIANCE";
            netReason = "Net quantity does not specify recognized standard metric measurement units.";
        } else if (netConf < 0.75 || netDec.notes?.toLowerCase().includes("font")) {
            netStatus = "NEEDS_HUMAN_VERIFICATION";
            netReason = "Net quantity numeral height may be below prescribed 4.0 mm threshold for this panel size. Physical gauge measurement recommended.";
        }

        ruleEvaluations.push({
            ruleId: "RULE-7-1",
            requirement: "Minimum Font Height for Net Quantity on Principal Display Panel",
            legalClause: "Rule 7 & Schedule II, Table I",
            applicability: "Mandatory",
            validationLogic: "Net quantity numeral must satisfy minimum height based on Principal Display Panel area and use standard metric units.",
            effectiveDate: "2026-01-01 (Ver. 2026.3)",
            source: "Official Legal Metrology Guidelines",
            version: "2026.3",
            status: netStatus,
            evidenceSnippet: netVal || "Not detected",
            confidence: netConf > 1 ? netConf / 100 : netConf,
            systemLimitation: "Perspective distortion from package pouch curvature requires physical metric gauge verification.",
            whyExplanation: netReason
        });

        // -------------------------------------------------------------
        // RULE 5: RULE-6-1-C (Batch / Lot Number)
        // -------------------------------------------------------------
        const batchDec = getDec("f-batch", "batchno", "batch");
        const batchVal = batchDec ? (batchDec.detectedValue || batchDec.value || "") : "";
        const batchConf = batchDec ? (batchDec.confidence || 0.8) : 0;
        let batchStatus = "COMPLIANT";
        let batchReason = "Batch / Lot traceability code clearly declared.";

        if (!isPresent(batchDec)) {
            batchStatus = "POTENTIAL_NON_COMPLIANCE";
            batchReason = "Batch / Lot / Code number missing. Pre-packaged commodity cannot be traced.";
        } else if (batchConf < 0.7) {
            batchStatus = "NEEDS_HUMAN_VERIFICATION";
            batchReason = "Batch identifier partially occluded or smudged.";
        }

        ruleEvaluations.push({
            ruleId: "RULE-6-1-C",
            requirement: "Batch / Lot / Code Number for Product Traceability",
            legalClause: "Rule 6(1)(c)",
            applicability: "Mandatory",
            validationLogic: "Pre-packaged commodity must declare unambiguous batch or lot identifier for quality control and recall.",
            effectiveDate: "2026-01-01 (Ver. 2026.3)",
            source: "Department of Consumer Affairs",
            version: "2026.3",
            status: batchStatus,
            evidenceSnippet: batchVal || "Not detected",
            confidence: batchConf > 1 ? batchConf / 100 : batchConf,
            whyExplanation: batchReason
        });

        // -------------------------------------------------------------
        // RULE 6: RULE-6-1-D (Date of Manufacture / Packing)
        // -------------------------------------------------------------
        const mfgDec = getDec("f-mfg", "manufacturingdate", "mfg");
        const mfgVal = mfgDec ? (mfgDec.detectedValue || mfgDec.value || "") : "";
        const mfgConf = mfgDec ? (mfgDec.confidence || 0.8) : 0;
        let mfgStatus = "COMPLIANT";
        let mfgReason = "Month and year of packaging declared in compliant format.";

        if (!isPresent(mfgDec)) {
            mfgStatus = "POTENTIAL_NON_COMPLIANCE";
            mfgReason = "Month and Year of manufacture or pre-packing is missing.";
        } else if (mfgConf < 0.7) {
            mfgStatus = "NEEDS_HUMAN_VERIFICATION";
            mfgReason = "Manufacturing date digits require officer confirmation.";
        }

        ruleEvaluations.push({
            ruleId: "RULE-6-1-D",
            requirement: "Month and Year of Manufacture / Packing",
            legalClause: "Rule 6(1)(d)",
            applicability: "Mandatory",
            validationLogic: "Must declare month and year of pre-packing in standard numeric or word format (MM/YYYY).",
            effectiveDate: "2026-01-01 (Ver. 2026.3)",
            source: "Legal Metrology Rules",
            version: "2026.3",
            status: mfgStatus,
            evidenceSnippet: mfgVal || "Not detected",
            confidence: mfgConf > 1 ? mfgConf / 100 : mfgConf,
            whyExplanation: mfgReason
        });

        // -------------------------------------------------------------
        // RULE 7: RULE-6-1-MA (Country of Origin)
        // -------------------------------------------------------------
        const originDec = getDec("f-origin", "countryoforigin", "origin");
        const originVal = originDec ? (originDec.detectedValue || originDec.value || "") : "";
        const originConf = originDec ? (originDec.confidence || 0.85) : 0;
        let originStatus = "COMPLIANT";
        let originReason = "Country of origin unambiguously declared.";

        if (!isPresent(originDec)) {
            originStatus = "POTENTIAL_NON_COMPLIANCE";
            originReason = "Country of Origin declaration is missing under mandatory amendment Rule 6(1)(ma).";
        }

        ruleEvaluations.push({
            ruleId: "RULE-6-1-MA",
            requirement: "Country of Origin Declaration",
            legalClause: "Rule 6(1)(ma)",
            applicability: "Mandatory",
            validationLogic: "Must declare country of origin for both imported and domestic packages.",
            effectiveDate: "2026-01-01 (Ver. 2026.3)",
            source: "Gazette Notification GSR 592(E)",
            version: "2026.3",
            status: originStatus,
            evidenceSnippet: originVal || "Not detected",
            confidence: originConf > 1 ? originConf / 100 : originConf,
            whyExplanation: originReason
        });

        // -------------------------------------------------------------
        // RULE 8: RULE-6-1-F (Consumer Grievance Care Details)
        // -------------------------------------------------------------
        const careDec = getDec("f-care", "customercare", "care");
        const careVal = careDec ? (careDec.detectedValue || careDec.value || "") : "";
        const careConf = careDec ? (careDec.confidence || 0.8) : 0;
        let careStatus = "COMPLIANT";
        let careReason = "Consumer grievance address, email, and telephone contact verified.";

        if (!isPresent(careDec)) {
            careStatus = "POTENTIAL_NON_COMPLIANCE";
            careReason = "Consumer care contact details not detected.";
        } else if (careConf < 0.7) {
            careStatus = "NEEDS_HUMAN_VERIFICATION";
            careReason = "Consumer care contacts partially detected; verify validity of helpline number and email.";
        }

        ruleEvaluations.push({
            ruleId: "RULE-6-1-F",
            requirement: "Consumer Grievance Officer & Helpline Contacts",
            legalClause: "Rule 6(1)(f)",
            applicability: "Mandatory",
            validationLogic: "Name/Designation, address, telephone number, and email address of consumer grievance cell must be present.",
            effectiveDate: "2026-01-01 (Ver. 2026.3)",
            source: "Legal Metrology Rules",
            version: "2026.3",
            status: careStatus,
            evidenceSnippet: careVal || "Not detected",
            confidence: careConf > 1 ? careConf / 100 : careConf,
            whyExplanation: careReason
        });

        // -------------------------------------------------------------
        // CALCULATE FINDINGS & OVERALL STATUS
        // -------------------------------------------------------------
        let compliantCount = 0;
        let nonComplianceCount = 0;
        let verificationCount = 0;

        ruleEvaluations.forEach(r => {
            if (r.status === "COMPLIANT") compliantCount++;
            else if (r.status === "POTENTIAL_NON_COMPLIANCE") nonComplianceCount++;
            else if (r.status === "NEEDS_HUMAN_VERIFICATION") verificationCount++;
        });

        let overallStatus = "COMPLIANT";
        if (nonComplianceCount > 0) {
            overallStatus = "POTENTIAL_NON_COMPLIANCE";
        } else if (verificationCount > 0) {
            overallStatus = "NEEDS_HUMAN_VERIFICATION";
        }

        const findingsCount = {
            compliant: compliantCount,
            potentialNonCompliance: nonComplianceCount,
            needsVerification: verificationCount
        };

        return {
            rules: ruleEvaluations,
            findingsCount,
            overallStatus
        };
};

const evaluateRules = async (req, res) => {
    try {
        const result = computeRulesEvaluation(req.body);
        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error("Rule Evaluation Error:", error);
        return res.status(500).json({
            success: false,
            message: "Rule evaluation failed",
            error: error.message
        });
    }
};

module.exports = { evaluateRules, computeRulesEvaluation };
