const path = require("path");
const fs = require("fs");
const Tesseract = require("tesseract.js");

const cleanText = (text) => {
    if (!text || typeof text !== "string") return "";
    return text
        .replace(/\r/g, "")
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .join("\n");
};

/**
 * Helper to match first regex group or return null with match details
 */
const findValueWithDetails = (text, patterns) => {
    if (!text) return { value: "", confidence: 0, matchedPattern: null };

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            const val = match[1].trim();
            if (val.length > 0) {
                return {
                    value: val,
                    confidence: 90,
                    matchedPattern: pattern.toString()
                };
            }
        }
    }

    return { value: "", confidence: 0, matchedPattern: null };
};

/**
 * Calculates per-field confidence based on OCR baseline and heuristic validation
 */
const computeFieldConfidence = (fieldKey, value, globalConfidence) => {
    if (!value || value.toLowerCase() === "not detected" || value.trim() === "") {
        return 0;
    }

    const base = globalConfidence > 0 ? Math.min(Math.max(globalConfidence, 60), 95) : 85;

    switch (fieldKey) {
        case "batchNo": {
            const isValid = /^[A-Z0-9\/-]{3,20}$/i.test(value.trim());
            return Math.min(99, isValid ? base + 8 : base - 10);
        }
        case "mrp": {
            const hasNumber = /[0-9]+(?:\.[0-9]{1,2})?/.test(value);
            return Math.min(98, hasNumber ? base + 6 : base - 15);
        }
        case "netQuantity": {
            const hasMetric = /(?:g|kg|mg|ml|l|pcs?|pieces?)/i.test(value);
            return Math.min(99, hasMetric ? base + 8 : base - 10);
        }
        case "manufacturingDate":
        case "expiryDate": {
            const hasDate = /\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{1,2}[\/.-]\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(value);
            return Math.min(98, hasDate ? base + 7 : base - 10);
        }
        case "manufacturer": {
            const hasAddr = /(?:pvt|ltd|limited|plot|sector|road|street|industrial|area|pin|india)/i.test(value);
            return Math.min(98, hasAddr ? base + 6 : base - 5);
        }
        case "countryOfOrigin": {
            const hasCountry = /(?:india|bharat|usa|china|germany|vietnam|thailand|japan|korea|imported)/i.test(value);
            return Math.min(99, hasCountry ? base + 9 : base);
        }
        case "licenseNumber": {
            const hasLic = /\d{8,14}/.test(value) || /(?:fssai|bis|isi)/i.test(value);
            return Math.min(98, hasLic ? base + 8 : base - 10);
        }
        case "customerCare": {
            const hasContact = /@|\d{8,12}|1800/i.test(value);
            return Math.min(98, hasContact ? base + 7 : base - 8);
        }
        default:
            return Math.min(96, Math.max(70, base));
    }
};

const extractStatutoryDeclarations = async (imageInput) => {
    try {
        let input = imageInput;
    if (typeof imageInput === "string" && !imageInput.startsWith("data:")) {
        input = fs.readFileSync(imageInput);
    } else if (typeof imageInput === "string" && imageInput.startsWith("data:")) {
        const base64Data = imageInput.replace(/^data:image\/\w+;base64,/, "");
        input = Buffer.from(base64Data, "base64");
    }

    console.log("Starting OCR with Tesseract...");

    const localLangDir = path.resolve(__dirname, "../../");
    let ocrResult = null;

    try {
        ocrResult = await Tesseract.recognize(
            input,
            "eng",
            {
                langPath: localLangDir,
                gzip: false
            }
        );
        } catch (localErr) {
            console.warn("Local langPath recognize failed, falling back to standard recognize:", localErr.message);
            ocrResult = await Tesseract.recognize(input, "eng");
        }

        const data = ocrResult.data || {};
        const rawText = cleanText(data.text || "");
        const globalConfidence = Math.round(data.confidence || 0);

        console.log(`OCR complete. Raw text length: ${rawText.length}. Global confidence: ${globalConfidence}%`);

        const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);

        // 1. Batch Number
        const batchDetails = findValueWithDetails(rawText, [
            /(?:batch|batch\s*(?:no|num|number)|lot|lot\s*(?:no|num|number)|b\.?\s*no\.?)[\s.:#-]*([A-Z0-9\/-]+)/i,
            /(?:b\.?no|lot\.?no)[\s.:=]*([A-Z0-9\/-]+)/i
        ]);

        // 2. Maximum Retail Price (MRP)
        const mrpDetails = findValueWithDetails(rawText, [
            /(?:mrp|m\.r\.p|max\s*retail\s*price)[\s.:₹Rs-]*([0-9]+(?:\.[0-9]{1,2})?[\s\w()₹Rs.,-]*)/i,
            /(?:₹|rs\.?)\s*([0-9]+(?:\.[0-9]{1,2})?)/i
        ]);

        // 3. Net Quantity
        const netQtyDetails = findValueWithDetails(rawText, [
            /(?:net\s*(?:qty|quantity|wt|weight)|quantity)[\s.:=-]*([0-9]+(?:\.[0-9]+)?\s*(?:g|kg|mg|ml|l|ltr|pcs?|pieces?|units?|n))/i,
            /([0-9]+(?:\.[0-9]+)?\s*(?:g|kg|mg|ml|l|ltr)\b)/i
        ]);

        // 4. Manufacturing Date
        const mfgDetails = findValueWithDetails(rawText, [
            /(?:mfg|mfd|manufacturing|manufactured|pkd|packed|date\s*of\s*(?:mfg|packing))[\s.:=-]*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{1,2}[\/.-]\d{4}|[A-Z]{3}[\s.-]*\d{2,4})/i,
            /(?:mfg\.?|mfd\.?)\s*[:=]?\s*(\S+)/i
        ]);

        // 5. Expiry Date / Best Before
        const expDetails = findValueWithDetails(rawText, [
            /(?:exp|expiry|use\s*by|best\s*before)[\s.:=-]*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{1,2}[\/.-]\d{4}|(?:\d+\s*(?:months?|days?|years?)\s*(?:from|of)?[\s\w]*)|[A-Z]{3}[\s.-]*\d{2,4})/i,
            /(?:best\s*before)[\s.:=-]*(.+)/i
        ]);

        // 6. Manufacturer / Packer
        const mfrDetails = findValueWithDetails(rawText, [
            /(?:manufactured\s*(?:&|and)?\s*packed\s*by|manufactured\s*by|mfg\s*by|packed\s*by|marketed\s*by|mfr)[\s.:=-]*(.+)/i,
            /(?:by|at)\s*[:=-]\s*([A-Z][A-Za-z0-9\s.,&-]+(?:pvt|ltd|limited|industries|foods|enterprises))/i
        ]);

        // 7. Country of Origin
        const originDetails = findValueWithDetails(rawText, [
            /(?:country\s*of\s*origin|made\s*in|product\s*of|origin)[\s.:=-]*([A-Za-z\s()]+)/i
        ]);

        // 8. Consumer Care / Contact
        const customerCareDetails = findValueWithDetails(rawText, [
            /(?:consumer\s*care|customer\s*care|feedback|complaints|for\s*queries)[\s.:=-]*(.+)/i,
            /(?:toll\s*free|care@|helpline)[\s.:=-]*([0-9A-Za-z@._\s-]+)/i
        ]);

        // 9. License / Registration Number
        const licenseDetails = findValueWithDetails(rawText, [
            /(?:fssai|lic\.?\s*no\.?|license\s*no\.?|bis|isi\s*no\.?|registration\s*no\.?)[\s.:=-]*([A-Z0-9\/-]+)/i,
            /(?:licence\s*no\.?)[\s.:=-]*([0-9]+)/i
        ]);

        // 10. Ingredients
        const ingredientsDetails = findValueWithDetails(rawText, [
            /(?:ingredients|contents|composition)[\s.:=-]*(.+)/i
        ]);

        // 11. Brand
        const brandDetails = findValueWithDetails(rawText, [
            /(?:brand|trademark|tm)[\s.:=-]*([A-Za-z0-9\s]+)/i
        ]);

        // 12. Product Name
        let productNameVal = "";
        const prodMatch = rawText.match(/(?:commodity|product|item)[\s.:=-]*([A-Za-z0-9\s.,-]+)/i);
        if (prodMatch && prodMatch[1]) {
            productNameVal = prodMatch[1].trim();
        } else if (lines.length > 0) {
            const potential = lines.find(l => l.length > 3 && /[A-Za-z]/.test(l));
            productNameVal = potential || lines[0] || "";
        }

        const batchNo = batchDetails.value || "";
        const mrp = mrpDetails.value || "";
        const netQuantity = netQtyDetails.value || "";
        const manufacturingDate = mfgDetails.value || "";
        const expiryDate = expDetails.value || "";
        const manufacturer = mfrDetails.value || "";
        const countryOfOrigin = originDetails.value || (rawText.toLowerCase().includes("india") ? "India" : "");
        const customerCare = customerCareDetails.value || "";
        const licenseNumber = licenseDetails.value || "";
        const ingredients = ingredientsDetails.value || "";
        const brand = brandDetails.value || (productNameVal ? productNameVal.split(" ")[0] : "");
        const productName = productNameVal || "";

        const fieldConfidences = [
            { field: "productName", value: productName, confidence: computeFieldConfidence("productName", productName, globalConfidence) },
            { field: "brand", value: brand, confidence: computeFieldConfidence("brand", brand, globalConfidence) },
            { field: "manufacturer", value: manufacturer, confidence: computeFieldConfidence("manufacturer", manufacturer, globalConfidence) },
            { field: "batchNo", value: batchNo, confidence: computeFieldConfidence("batchNo", batchNo, globalConfidence) },
            { field: "mrp", value: mrp, confidence: computeFieldConfidence("mrp", mrp, globalConfidence) },
            { field: "netQuantity", value: netQuantity, confidence: computeFieldConfidence("netQuantity", netQuantity, globalConfidence) },
            { field: "manufacturingDate", value: manufacturingDate, confidence: computeFieldConfidence("manufacturingDate", manufacturingDate, globalConfidence) },
            { field: "expiryDate", value: expiryDate, confidence: computeFieldConfidence("expiryDate", expiryDate, globalConfidence) },
            { field: "countryOfOrigin", value: countryOfOrigin, confidence: computeFieldConfidence("countryOfOrigin", countryOfOrigin, globalConfidence) },
            { field: "ingredients", value: ingredients, confidence: computeFieldConfidence("ingredients", ingredients, globalConfidence) },
            { field: "customerCare", value: customerCare, confidence: computeFieldConfidence("customerCare", customerCare, globalConfidence) },
            { field: "licenseNumber", value: licenseNumber, confidence: computeFieldConfidence("licenseNumber", licenseNumber, globalConfidence) }
        ];

        const confMap = {};
        fieldConfidences.forEach(f => { confMap[f.field] = f.confidence; });

        const determineStatus = (val, conf, isMandatory) => {
            if (!val || val === "Not detected" || val.trim() === "") {
                return isMandatory ? "POTENTIAL_NON_COMPLIANCE" : "NEEDS_HUMAN_VERIFICATION";
            }
            if (conf < 70) {
                return "NEEDS_HUMAN_VERIFICATION";
            }
            return "COMPLIANT";
        };

        const declarations = [
            {
                fieldId: "f-mfr",
                label: "Manufacturer / Packer / Importer",
                hindiLabel: "निर्माता / पैकर का नाम व पता",
                detectedValue: manufacturer || "Not detected",
                confidence: confMap.manufacturer / 100,
                sourceRegion: "Back Panel · Region 01",
                status: determineStatus(manufacturer, confMap.manufacturer, true),
                ruleId: "RULE-6-1-A",
                isMandatory: true,
                notes: manufacturer ? "" : "Mandatory manufacturer identity declaration not clearly detected."
            },
            {
                fieldId: "f-name",
                label: "Common / Generic Name",
                hindiLabel: "वस्तु का सामान्य नाम",
                detectedValue: productName || "Not detected",
                confidence: confMap.productName / 100,
                sourceRegion: "Front PDP · Region 01",
                status: determineStatus(productName, confMap.productName, true),
                ruleId: "RULE-6-1-B",
                isMandatory: true,
                notes: productName ? "" : "Mandatory generic or common product name missing."
            },
            {
                fieldId: "f-net-qty",
                label: "Net Quantity",
                hindiLabel: "शुद्ध मात्रा",
                detectedValue: netQuantity || "Not detected",
                confidence: confMap.netQuantity / 100,
                sourceRegion: "Front PDP · Region 03",
                status: determineStatus(netQuantity, confMap.netQuantity, true),
                ruleId: "RULE-7-1",
                isMandatory: true,
                notes: netQuantity ? "" : "Net quantity with standard metric units required."
            },
            {
                fieldId: "f-mrp",
                label: "Maximum Retail Price (MRP)",
                hindiLabel: "अधिकतम खुदरा मूल्य",
                detectedValue: mrp || "Not detected",
                confidence: confMap.mrp / 100,
                sourceRegion: "Back Panel · Region 04",
                status: determineStatus(mrp, confMap.mrp, true),
                ruleId: "RULE-6-1-E",
                isMandatory: true,
                notes: mrp ? "" : "Statutory MRP inclusive of all taxes must be declared."
            },
            {
                fieldId: "f-batch",
                label: "Batch / Lot Number",
                hindiLabel: "बैच / लॉट संख्या",
                detectedValue: batchNo || "Not detected",
                confidence: confMap.batchNo / 100,
                sourceRegion: "Back Panel · Region 02",
                status: determineStatus(batchNo, confMap.batchNo, true),
                ruleId: "RULE-6-1-C",
                isMandatory: true,
                notes: batchNo ? "" : "Batch number or code required for pre-packaged commodities."
            },
            {
                fieldId: "f-mfg",
                label: "Date of Manufacture / Packing",
                hindiLabel: "निर्माण / पैकिंग की तिथि",
                detectedValue: manufacturingDate || "Not detected",
                confidence: confMap.manufacturingDate / 100,
                sourceRegion: "Back Panel · Region 06",
                status: determineStatus(manufacturingDate, confMap.manufacturingDate, true),
                ruleId: "RULE-6-1-D",
                isMandatory: true,
                notes: manufacturingDate ? "" : "Month and year of manufacture or packaging required."
            },
            {
                fieldId: "f-exp",
                label: "Best Before / Expiry Date",
                hindiLabel: "उपयोग की अंतिम तिथि",
                detectedValue: expiryDate || "Not detected",
                confidence: confMap.expiryDate / 100,
                sourceRegion: "Back Panel · Region 07",
                status: determineStatus(expiryDate, confMap.expiryDate, false),
                ruleId: "RULE-6-1-D-EX",
                isMandatory: false,
                notes: expiryDate ? "" : "Recommended for consumable or perishable commodities."
            },
            {
                fieldId: "f-origin",
                label: "Country of Origin",
                hindiLabel: "मूल देश",
                detectedValue: countryOfOrigin || "Not detected",
                confidence: confMap.countryOfOrigin / 100,
                sourceRegion: "Back Panel · Region 05",
                status: determineStatus(countryOfOrigin, confMap.countryOfOrigin, true),
                ruleId: "RULE-6-1-MA",
                isMandatory: true,
                notes: countryOfOrigin ? "" : "Mandatory country of origin declaration under Rule 6(1)(ma)."
            },
            {
                fieldId: "f-care",
                label: "Consumer Care Contact Details",
                hindiLabel: "उपभोक्ता देखरेख संपर्क",
                detectedValue: customerCare || "Not detected",
                confidence: confMap.customerCare / 100,
                sourceRegion: "Back Panel · Region 08",
                status: determineStatus(customerCare, confMap.customerCare, true),
                ruleId: "RULE-6-1-F",
                isMandatory: true,
                notes: customerCare ? "" : "Consumer grievance contact (email/phone/address) required."
            },
            {
                fieldId: "f-license",
                label: "License / Registration Number",
                hindiLabel: "लाइसेंस / पंजीकरण संख्या",
                detectedValue: licenseNumber || "Not detected",
                confidence: confMap.licenseNumber / 100,
                sourceRegion: "Back Panel · Region 09",
                status: determineStatus(licenseNumber, confMap.licenseNumber, false),
                ruleId: "RULE-LIC-1",
                isMandatory: false,
                notes: ""
            }
        ];

        const boundingBoxes = [
            {
                id: "box-mrp",
                label: "Maximum Retail Price (MRP)",
                value: mrp || "Not detected",
                status: determineStatus(mrp, confMap.mrp, true),
                x: 58,
                y: 65,
                width: 32,
                height: 12,
                confidence: confMap.mrp / 100,
                ruleId: "RULE-6-1-E",
                ruleName: "MRP Declaration & Alteration Prohibition",
                sourceRegion: "Back Panel · Region 04",
                issueReason: mrp ? "" : "MRP not detected on inspected evidentiary frame."
            },
            {
                id: "box-net-qty",
                label: "Net Quantity",
                value: netQuantity || "Not detected",
                status: determineStatus(netQuantity, confMap.netQuantity, true),
                x: 15,
                y: 70,
                width: 28,
                height: 12,
                confidence: confMap.netQuantity / 100,
                ruleId: "RULE-7-1",
                ruleName: "Minimum Numeral Height & Metric Units",
                sourceRegion: "Front PDP · Region 03",
                issueReason: netQuantity ? "" : "Net quantity missing or unit non-compliant."
            },
            {
                id: "box-mfr",
                label: "Manufacturer / Packer Details",
                value: manufacturer || "Not detected",
                status: determineStatus(manufacturer, confMap.manufacturer, true),
                x: 10,
                y: 20,
                width: 48,
                height: 18,
                confidence: confMap.manufacturer / 100,
                ruleId: "RULE-6-1-A",
                ruleName: "Complete Name & Address of Manufacturer",
                sourceRegion: "Back Panel · Region 01",
                issueReason: manufacturer ? "" : "Manufacturer premise address incomplete."
            },
            {
                id: "box-batch",
                label: "Batch & Date Coding",
                value: `Batch: ${batchNo || "N/A"} | Mfg: ${manufacturingDate || "N/A"}`,
                status: determineStatus(batchNo, confMap.batchNo, true),
                x: 55,
                y: 40,
                width: 35,
                height: 14,
                confidence: confMap.batchNo / 100,
                ruleId: "RULE-6-1-C",
                ruleName: "Batch Code & Manufacturing Date",
                sourceRegion: "Back Panel · Region 02",
                issueReason: batchNo ? "" : "Batch code not clearly legible."
            }
        ];

        const extractedData = {
            productName,
            brand,
            manufacturer,
            batchNo,
            mrp,
            netQuantity,
            manufacturingDate,
            expiryDate,
            countryOfOrigin,
            ingredients,
            customerCare,
            licenseNumber
        };

        return {
            success: true,
            confidence: globalConfidence,
            fieldConfidences,
            extractedData,
            declarations,
            boundingBoxes,
            rawText
        };
    } catch (error) {
        console.error("OCR Processing Error in extractStatutoryDeclarations:", error);
        throw error;
    }
};

const runOCR = async (req, res) => {
    try {
        let imageInput = null;

        if (req.file && req.file.buffer) {
            imageInput = req.file.buffer;
        } else if (req.body && req.body.image) {
            imageInput = req.body.image;
        }

        if (!imageInput) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded. Pass image as multipart form-data 'image' or body 'image'."
            });
        }

        const result = await extractStatutoryDeclarations(imageInput);
        return res.json(result);
    } catch (error) {
        console.error("OCR Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "OCR processing failed",
            error: error.message
        });
    }
};

module.exports = { runOCR, extractStatutoryDeclarations };