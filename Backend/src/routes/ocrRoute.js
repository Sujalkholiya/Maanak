const express = require("express");
const multer = require("multer");
const { runOCR } = require("../Controllers/ocrController");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post("/", upload.single("image"), runOCR);

module.exports = router;