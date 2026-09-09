require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const dns = require("dns");
const productRoutes = require("./routes/product.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const imageRoutes = require("./routes/image.routes.js");
const homeRoute = require("./routes/home.js");
const caseRoute = require("./routes/case.js");
const ocrRoute = require("./routes/ocrRoute.js");
const applicabilityRoute = require("./routes/applicability.routes.js");
const ruleRoute = require("./routes/rule.routes.js");

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
]);
const app = express();

// CORS Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use("/api/product", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/image", imageRoutes);
app.use("/", homeRoute);
app.use("/cases", caseRoute);
app.use("/ocr", ocrRoute);
app.use("/applicability", applicabilityRoute);
app.use("/rules", ruleRoute);

module.exports = app;