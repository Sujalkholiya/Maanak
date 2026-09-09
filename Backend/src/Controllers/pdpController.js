/**
 * Deterministic PDP (Principal Display Panel) & Font Measurement Engine
 * Under Rule 9 and Schedule II of Legal Metrology (Packaged Commodities) Rules, 2011
 */

const calculatePdpArea = ({ packageShape = "rectangular", heightCm = 15, widthCm = 10, circumferenceCm = 0, totalAreaCm = 0 }) => {
    const shape = packageShape.toLowerCase();
    let pdpArea = 0;
    let calculationMethod = "";

    switch (shape) {
        case "cylindrical":
        case "bottle":
        case "can": {
            const circ = circumferenceCm || (widthCm * Math.PI);
            pdpArea = 0.40 * heightCm * circ;
            calculationMethod = "Rule 9(2)(b): 40% of height × circumference";
            break;
        }
        case "spherical":
        case "other": {
            pdpArea = totalAreaCm > 0 ? 0.20 * totalAreaCm : 0.20 * (heightCm * widthCm * 4);
            calculationMethod = "Rule 9(2)(c): 20% of total surface area";
            break;
        }
        case "rectangular":
        case "box":
        case "pouch":
        default: {
            pdpArea = heightCm * widthCm;
            calculationMethod = "Rule 9(2)(a): Height × Width of the primary face";
            break;
        }
    }

    return {
        pdpAreaSqCm: Math.round(pdpArea * 100) / 100,
        calculationMethod
    };
};

const getStatutoryMinimumFontHeight = (pdpAreaSqCm, isEmbossedOrMolded = false) => {
    if (pdpAreaSqCm <= 50) {
        return {
            minNumeralHeightMm: isEmbossedOrMolded ? 1.5 : 1.0,
            areaTier: "Area <= 50 cm²",
            scheduleRef: "Schedule II, Serial 1"
        };
    } else if (pdpAreaSqCm <= 200) {
        return {
            minNumeralHeightMm: isEmbossedOrMolded ? 3.0 : 2.0,
            areaTier: "50 cm² < Area <= 200 cm²",
            scheduleRef: "Schedule II, Serial 2"
        };
    } else if (pdpAreaSqCm <= 1000) {
        return {
            minNumeralHeightMm: isEmbossedOrMolded ? 6.0 : 4.0,
            areaTier: "200 cm² < Area <= 1000 cm²",
            scheduleRef: "Schedule II, Serial 3"
        };
    } else {
        return {
            minNumeralHeightMm: isEmbossedOrMolded ? 10.0 : 6.0,
            areaTier: "Area > 1000 cm²",
            scheduleRef: "Schedule II, Serial 4"
        };
    }
};

const evaluatePdp = async (req, res) => {
    try {
        const {
            packageShape = "rectangular",
            heightCm = 18.5,
            widthCm = 12.0,
            circumferenceCm = 0,
            totalAreaCm = 0,
            isEmbossedOrMolded = false,
            measuredDeclarations = []
        } = req.body;

        const { pdpAreaSqCm, calculationMethod } = calculatePdpArea({
            packageShape,
            heightCm,
            widthCm,
            circumferenceCm,
            totalAreaCm
        });

        const { minNumeralHeightMm, areaTier, scheduleRef } = getStatutoryMinimumFontHeight(
            pdpAreaSqCm,
            isEmbossedOrMolded
        );

        // Default samples if none provided
        const itemsToVerify = measuredDeclarations.length > 0 ? measuredDeclarations : [
            { declarationKey: "netQuantity", label: "Net Quantity Numeral", measuredHeightMm: 2.8 },
            { declarationKey: "mrp", label: "MRP Numeral", measuredHeightMm: 2.5 },
            { declarationKey: "manufacturer", label: "Manufacturer Address", measuredHeightMm: 1.2 }
        ];

        const evaluatedDeclarations = itemsToVerify.map(item => {
            const measured = Number(item.measuredHeightMm) || 0;
            const isCompliant = measured >= minNumeralHeightMm;
            return {
                declarationKey: item.declarationKey || item.fieldId || "declaration",
                label: item.label || "Mandatory Declaration",
                measuredHeightMm: measured,
                statutoryMinimumMm: minNumeralHeightMm,
                isCompliant,
                status: isCompliant ? "COMPLIANT" : "POTENTIAL_NON_COMPLIANCE",
                differenceMm: Math.round((measured - minNumeralHeightMm) * 100) / 100,
                legalClause: `Rule 9 & ${scheduleRef}`,
                notes: isCompliant
                    ? `Complies with minimum ${minNumeralHeightMm} mm requirement.`
                    : `Non-compliant: Measured ${measured} mm is below statutory minimum ${minNumeralHeightMm} mm.`
            };
        });

        const overallStatus = evaluatedDeclarations.every(d => d.isCompliant)
            ? "COMPLIANT"
            : "POTENTIAL_NON_COMPLIANCE";

        return res.json({
            success: true,
            packageDimensions: {
                packageShape,
                heightCm,
                widthCm,
                circumferenceCm
            },
            pdpAreaSqCm,
            calculationMethod,
            statutoryRule: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 9",
            scheduleRef,
            areaTier,
            minNumeralHeightMm,
            overallStatus,
            evaluatedDeclarations
        });
    } catch (error) {
        console.error("PDP Evaluation Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to evaluate PDP and font height",
            error: error.message
        });
    }
};

module.exports = {
    evaluatePdp,
    calculatePdpArea,
    getStatutoryMinimumFontHeight
};
