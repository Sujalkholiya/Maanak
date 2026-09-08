require('dotenv').config();
const app = require("./src/app.js");
const connectdb = require("./src/Database/database.js");

app.listen(3000, ()=> {
    console.log("The Server is Started Now.........");
});

connectdb();