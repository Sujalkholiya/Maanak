const express = require("express");
const cookieParser = require("cookie-parser");
const dns = require("dns");
const productRoutes = require("./routes/product.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const imageRoutes = require("./routes/image.routes.js");

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
]);
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/product", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/image", imageRoutes);


module.exports = app;