const express = require("express")
const {sendMessage, getMessage, getAllMessage} = require("../controllers/messageController")


const router = express.Router()

router.post("/", sendMessage)

router.get("/", getMessage)
router.get("/all",getAllMessage)
module.exports = router