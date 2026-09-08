const productModel = require("../Models/product.model.js");

async function createProduct(req, res) {
    try {
        const { name, price } = req.body;
        if (!name || price === undefined || price === null) {
            return res.status(400).json({ message: "Name and price are required" });
        }
        const product = await productModel.create({ name, price});
        res.status(201).json({ message: "Product created", data: product });
    } catch (error) {
        res.status(500).json({ message: "Failed to create product", error: error.message });
    }
}

async function getProducts(req, res) {
    try {
        const products = await productModel.find();
        res.status(200).json({ message: "Products fetched", data: products });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}

module.exports = { createProduct, getProducts };
