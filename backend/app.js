const express = require("express")
const app = express()
const db = require("./utils/db-connection")
const http = require("http")
require("dotenv").config()
const PORT = process.env.PORT||3000
const {Server} = require("socket.io")
const cors = require("cors")
require("./models")
require("./cron/deleteMessages")
const server = http.createServer(app)
const authMiddleware = require("./middlewares/authMiddleware")
const socketIO = require('./socket/index')



// importent middleware 
app.use(express.json())
app.use(cors())


const io= socketIO(server)

const userRouter = require("./routers/userRouter")
const messageRouter = require("./routers/messageRoute")
const User = require("./models/users")

// user route
app.use("/users", userRouter)

// message route 
app.use("/message",authMiddleware, messageRouter)
















db.sync({ alter: true }).then(() => {
console.log("db ok")
}).catch((err) => {
console.log("db  error",err)
})


server.listen(PORT, () => {
console.log("Server connected",PORT)
})