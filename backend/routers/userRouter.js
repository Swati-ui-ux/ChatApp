const express = require("express")
const {signupUser, loginUser, checkEmail, forgotPassword, resetPassword} = require("../controllers/userController")


const router = express.Router()

router.post("/signup", signupUser)
router.post("/login",loginUser)
router.post("/check-email",checkEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token",resetPassword)
module.exports = router