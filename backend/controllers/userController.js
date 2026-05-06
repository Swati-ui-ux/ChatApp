const User = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail")
const { Op } = require("sequelize")


// signup user
const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
        return res.status(404).json({message:"name is require"})
        }
        
         if (!email) {
        return res.status(404).json({message:"email is require"})
        }
        
        if (!password) {
        return res.status(404).json({message:"password is require"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({name, email, password:hashedPassword});
        if (!user) {
        return res.status(400).json({message:"user not created"})
        }
     console.log(user)
        res.status(200).json({message:"User created successfully"})
    } catch (error) {
        console.log(error)
         res.status(500).json({message:"server error"})
    }
    

}

// login user
const loginUser = async (req,res) => {
try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
    return res.status(404).json({message:"user not found"})
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
    return res.status(404).json({message:"wrong password"})
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1d" })
   
    
    console.log("Token", token)
     return res.status(200).json({message:"login success",token,userId:user.id,email,name:user.name})
} catch (error) {
    console.log(error)
     return res.status(500).json({message:"server error"})
}
}

const checkEmail = async (req, res) => {
try {
    const { email } = req.body
    const user = await User.findOne({
        where: {
            email,
        }
    })
    if (!user) {
    return res.status(404).json({ success: false, message: "Email not found" });
    }
     return res.status(200).json({ success: true, message: "User found", user });
} catch (error) {
     return res.status(500).json({ success: false, message: err.message });
}

}


const forgotPassword = async (req, res) => {
    const { email } = req.body
    // console.log("Email in forgot",email)
    const user = await User.findOne({where:{email} })
    // console.log("User in forgot",user)
    if (!user) {
    return res.status(404).json({message:"User not found"})
    }
    const token = crypto.randomBytes(32).toString("hex")
    user.resetToken = token
    user.resetTokenExpire = Date.now() + 60 * 60 * 1000
    await user.save()
    const link = `http://localhost:5173/reset-password/${token}`
    await sendEmail(email, link)
    res.json({message:"Reset link sent"})
}


const resetPassword = async (req,res) => {
try {
    const {token} = req.params
    const { password } = req.body
    const user = await User.findOne({where:{
        resetToken: token,
        resetTokenExpire: { [Op.gt]: Date.now() },
        
        
    }})
    console.log("User in reset",user)
    if (!user) {
    return res.status(400).json({message:"Invalid or expire token"})
    }
    user.password = await bcrypt.hash(password, 10)
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
     res.status(200).json({ message: "password reset successful" })

} catch (error) {
     console.log(error);
    res.status(500).json({ message: "Server error" });
}

}
module.exports = {signupUser,loginUser,checkEmail,forgotPassword,resetPassword}