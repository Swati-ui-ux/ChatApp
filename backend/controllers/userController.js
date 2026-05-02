const User = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


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
    const token = jwt.sign({userId:user.id,email:user.email},process.env.SECRET_KEY,{expiresIn:"1d"})
    console.log("Token", token)
     return res.status(200).json({message:"login success",token})
} catch (error) {
    console.log(error)
     return res.status(500).json({message:"server error"})
}
}
module.exports = {signupUser,loginUser}