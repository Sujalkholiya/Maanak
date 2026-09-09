/**
 * Deterministic Applicability Engine for Legal Metrology (Packaged Commodities) Rules, 2011
 */

const computeApplicability = (params = {}) => {
    const {
        product = "",
        productName = "",
        commodity = "",
        category = "",
        packageType = "",
        packagingType = "",
        isImported = false,
        isInstitutional = false,
        declarations = []
    } = params;

        const effectiveProduct = (product || productName || "Packaged Commodity").trim();
        const effectiveCategory = (category || "General Pre-Packaged Good").trim();
        const effectivePackageType = (packageType || "Retail Pre-Packaged Container / Pouch").trim();

        // Detect net quantity declaration to check if > 50g / 50ml threshold for USP
        const netQtyDec = (declarations || []).find(d => 
            d.fieldId === 'f-net-qty' || 
            (d.label && d.label.toLowerCase().includes('net quantity')) ||
            (d.field && d.field === 'netQuantity')
        );
        const netQtyVal = netQtyDec ? (netQtyDec.detectedValue || netQtyDec.value || "") : "";
        const isAbove50g = /(\b[5-9]\d|\b\d{3,})\s*(?:g|ml)\b|\b\d+(?:\.\d+)?\s*(?:kg|l|ltr)\b/i.test(netQtyVal);

        const rationalePoints = [];
        let applicableRequirementsCount = 7; // Base mandatory Rule 6(1) declarations
        let conditionalRequirementsCount = 0;
        let potentialExemptionsCount = 0;

        // 1. Institutional vs Retail Consumer evaluation (Rule 3(c))
        if (isInstitutional) {
            potentialExemptionsCount += 2;
            rationalePoints.push(
                "Trade Channel Classified as Institutional / Industrial Consumer: Qualified for Rule 3(c) exemption on retail display pricing."
            );
        } else {
            rationalePoints.push(
                "Retail Consumer Distribution Channel: Governed by standard Rule 6 mandatory consumer protection declarations."
            );
        }

        // 2. Origin Evaluation (Rule 6(1)(ma))
        if (isImported) {
            conditionalRequirementsCount += 1;
            applicableRequirementsCount += 1;
            rationalePoints.push(
                "Consignment Origin: Classified as Imported. Mandatory Country of Origin and Importer Identification required under Rule 6(1)(ma)."
            );
        } else {
            rationalePoints.push(
                "Consignment Origin: Domestic manufacture. Standard packer and origin declarations required under Rule 6(1)(a)."
            );
        }

        // 3. Net Quantity & Unit Sale Price (Rule 6(1)(da))
        if (isAbove50g) {
            conditionalRequirementsCount += 1;
            applicableRequirementsCount += 1;
            rationalePoints.push(
                `Net Quantity Scale (${netQtyVal || '>50g'}): Exceeds 50g threshold; mandatory Unit Sale Price (USP) applies under Rule 6(1)(da).`
            );
        } else {
            rationalePoints.push(
                "Net Quantity Scale: Standard metric measurement declarations apply under Schedule II."
            );
        }

        // 4. Commodity Specific Assessment
        const lowerCat = effectiveCategory.toLowerCase();
        if (lowerCat.includes("food") || lowerCat.includes("edible") || lowerCat.includes("grain") || lowerCat.includes("oil")) {
            applicableRequirementsCount += 1;
            rationalePoints.push(
                "Food Category Classification: FSSAI registration endorsement and Best Before / Expiry declaration required under Food Safety statutory overlap."
            );
        } else if (lowerCat.includes("electronic") || lowerCat.includes("appliance")) {
            conditionalRequirementsCount += 1;
            rationalePoints.push(
                "Electronics Classification: Consumer grievance contact and country of manufacture mandatory."
            );
        } else {
            rationalePoints.push(
                "General Packaged Commodity: Governed by Schedule II commodity specifications (Demo / configurable compliance rule)."
            );
        }

        const statutoryBasis = 
            "Legal Metrology (Packaged Commodities) Rules, 2011 (Amended 2026.3), Rule 6(1) & Schedule II.";

        const result = {
            commodity: effectiveProduct,
            packageType: effectivePackageType,
            isImported: Boolean(isImported),
            isInstitutional: Boolean(isInstitutional),
            packageCategory: isInstitutional ? "Industrial / Institutional Consignment" : "Standard Retail Commodity",
            applicableRequirementsCount,
            conditionalRequirementsCount,
            potentialExemptionsCount,
            statutoryBasis,
            rationalePoints
        };

        return result;
};

const evaluateApplicability = async (req, res) => {
    try {
        const result = computeApplicability(req.body);
        return res.status(200).json({
            success: true,
            applicability: result
        });
    } catch (error) {
        console.error("Applicability evaluation error:", error);
        return res.status(500).json({
            success: false,
            message: "Applicability evaluation failed",
            error: error.message
        });
    }
};

module.exports = { evaluateApplicability, computeApplicability };
