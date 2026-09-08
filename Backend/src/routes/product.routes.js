const express = require("express");
const router = express.Router();
const productController = require("../Controllers/product.controller.js");

router.post("/post", productController.createProduct);
router.get("/get", productController.getProducts);

module.exports = router;
