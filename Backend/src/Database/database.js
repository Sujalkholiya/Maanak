const mongoose = require("mongoose");


async function connectDatabase () {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Databse is Connected Successfully..........");
    }catch(err){
    console.error("The Database is Failed to Connect........",err);};
};

module.exports = connectDatabase;