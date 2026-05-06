const express = require("express")
const {signupUser, loginUser, checkEmail} = require("../controllers/userController")


const router = express.Router()

router.post("/signup", signupUser)
router.post("/login",loginUser)
router.post("/check-email",checkEmail)

module.exports = router