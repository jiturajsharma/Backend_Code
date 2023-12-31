const userModel = require("../model/userSchema.js");
const emailValidator = require("email-validator");
const bcrypt = require('bcrypt')


const signup = async (req, res, next)=>{
    const {name, email, password, confirmPassword} = req.body;
    // console.log(name, email, password, confirmPassword);

    //if someOne not give any required field so on...
    if(!name || !email ||!password ||!confirmPassword){
        return res.status(400).json({
            success: false,
            message: 'Every field is required'
        })
    }
// if someone give the Invalid email so we can...
const validEmail = emailValidator.validate(email);
if(!validEmail){
    return res.status(400).json({
        success: false,
        message: "please provide a valid email id"
    })
}

//if someone give password & confirmPassword so we want give some error so on...
if(password !== confirmPassword){
    return res.status(400).json({
        success: false,
        message: "passsword and confirm password doen't match"
    })
}

    try{  
    const userInfo = userModel(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
        success: true,
        data: result
    })
    }catch(e){
        if(e.code ===11000){
            return res.status(400).json({
                success: false,
                message: e.message
            })
        }
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}


const signin = async (req, res) =>{
    const{email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "Every field is mandotary"
        })
    }

    try{
        const user = await userModel
    .findOne({
        email
    })
    .select('+password')
    if(!user || (await bcrypt.compare(password, user.password))){
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        })
    }
    const token = user.jwtToken();
    user.password = undefined;

    const cookieOption = {
        maxAge: 24 * 60* 60* 1000,
        httpOnly: true
    };
    res.cookie("token",token, cookieOption);
    res.status(200).json({
        success: true,
        data: user
    })

    }catch(e){
        res.status(400).json({
            success: false,
            message: e.message
        })

    }
}

const getUser = async (req, res, next)=>{
    const userId = req.user.id;
    try{
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        })
    }catch(e){
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

const logout = (req, res)=>{
    try{
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        };
        res.cookie("token", null, cookieOption);
        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    }catch(e){
        res.status(400).json({
            success: false,
            message: e.message
        })

    }
}

module.exports = {
    signup,
    signin,
    getUser,
    logout
}