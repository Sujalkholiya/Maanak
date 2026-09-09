const imageModel = require("../Models/image.model.js");
const storageService = require("../Services/Storage.service.js");

async function createImage(req, res) {
    try {
        const files = req.files ? req.files.images : [];

        if (!files || files.length < 4 || files.length > 6) {
            return res.status(400).json({ message: "Upload between 4 and 6 images only (min 4, max 6)" });
        }

        const title = req.body.title || "";
        const product = req.body.product ? req.body.product.trim() : "";
        if (!product || product.length !== 24) {
            return res.status(400).json({ message: "Valid product ObjectId (24 chars) is required in 'product' field" });
        }

        const uploaded = [];
        for (let i = 0; i < files.length; i++) {
            const result = await storageService.uploadFiles(files[i].buffer, files[i].originalname || `image_${i}`);
            uploaded.push(result.url);
        }

        const imageData = {
            uri1: uploaded[0],
            uri2: uploaded[1],
            uri3: uploaded[2],
            uri4: uploaded[3],
            title: title,
            product: product
        };
        if (uploaded[4]) imageData.uri5 = uploaded[4];
        if (uploaded[5]) imageData.uri6 = uploaded[5];

        const imageUpload = await imageModel.create(imageData);

        res.status(201).json({
            message: "Images created successfully",
            data: imageUpload,
            count: files.length
        });
    } catch (error) {
        console.error("Image upload error:", error.message || error);
        res.status(500).json({ message: "Image upload failed", error: error.message || error });
    }
}

async function getAllimages(req, res) {
    try {
        const images = await imageModel.find().limit(20);
        res.status(200).json({
            message: "Images fetched successfully",
            images
        });
    } catch (error) {
        console.error("Fetch images error:", error.message || error);
        res.status(500).json({ message: "Failed to fetch images", error: error.message || error });
    }
}

module.exports = { createImage, getAllimages };
