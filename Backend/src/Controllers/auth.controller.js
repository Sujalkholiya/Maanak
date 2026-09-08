                                                                                                                                                                                                                                                                                                        const userModel = require("../Models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser (req,res) {
    const {UserName,Email,Password,Role =  "User"} = req.body;

    const isUserExist = await userModel.findOne({
        $or: [
            {UserName},
            {Email}
        ]
    });

    if(isUserExist){
        return res.status(409).json({
                     message : "User Already Exsits......"
                });
    }

    const hash = await bcrypt.hash(Password, 10);

    const User = await userModel.create({
        UserName,
        Email,
        Password : hash,
        Role
    });

    const token = jwt.sign({ID : User._id, Role: User.Role}, process.env.JSON_SECRET);

    res.cookie("Token",token);

    res.status(201).json({
        message: "User Registered Successfully........",
        Post : {
            id : User._id,
            UserName : User.UserName,
            Email : User.Email,
            Role : User.Role
        }
    });

};

async function loginUser(req,res) {
    const {UserName,Email,Password} = req.body;
    const User = await userModel.findOne({
        $or: [
           { UserName : UserName},
            { Email : Email }
        ]
    });  

    if(!User){
        return res.status(401).json({
            message : "Invalid Credentials.............."
        });
    }

    const isValidPassword = await bcrypt.compare(Password, User.Password);

    if(!isValidPassword){
        return res.status(401).json({
            message : "Invalid Credentials............"
        });      
    }

    const token = jwt.sign({ID: User._id, Role: User.Role}, process.env.JSON_SECRET);

    res.cookie("Token", token);

    res.status(200).json({
        message : "User Logged Successfully.........",
        Post : {
            id : User._id,
            UserName : User.UserName,
            Email : User.Email,
            Role : User.Role
        }
    });
};

module.exports = {registerUser, loginUser};
