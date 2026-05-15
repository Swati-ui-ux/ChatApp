const nodemailer = require("nodemailer")
require("dotenv").config()
// console.log("email", process.env.EMAIL, "Password", process.env.EMAIL_PASSWORD)

const sendEmail = async (email, link) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD,
        },
    })
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset",
        html:`<h1>Reset Password</h1><a href='${link}'>Click here</a> `
    
    })
}


module.exports = sendEmail