const mongooese = require("mongoose");

const userSchema = mongooese.Schema({
    UserName : {type : String, required : true, unique: true},
    Email : {type: String, required : true,unique : true},
    Password : {type: String, required : true,unique : true},
    
});

const userModel = mongooese.model("User", userSchema);

module.exports = userModel; 