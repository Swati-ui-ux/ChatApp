const express = require("express")
const app = express()
const db = require("./utils/db-connection")
const http = require("http")
const PORT = process.env.PORT||3000
const {Server} = require("socket.io")
const cors = require("cors")

require("./models")

const server = http.createServer(app)
const authMiddleware = require("./middlewares/authMiddleware")

// importent middleware 
app.use(express.json())
app.use(cors())


const userRouter = require("./routers/userRouter")
const messageRouter = require("./routers/messageRoute")

// user route
app.use("/users", userRouter)

// message route 
app.use("/message",authMiddleware, messageRouter)


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },

})

io.on("connection", (socket) => {
    console.log("User connected", socket.id)
    // send message
    socket.on("send_message", (data) => {
        
        console.log("User", "message : said", data.message)
        
        // receive message
        io.emit("receive_message",data)
    })
})







db.sync({ alter: true }).then(() => {
console.log("db ok")
}).catch((err) => {
console.log("db  error",err)
})


server.listen(PORT, () => {
console.log("Server connected",PORT)
})