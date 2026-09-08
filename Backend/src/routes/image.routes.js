const express = require("express");
const imageController = require("../Controllers/image.controller.js");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.fields([{ name: "images", maxCount: 6 }]), imageController.createImage);

router.get("/all", imageController.getAllimages);

module.exports = router;