const express = require("express")
const app = express()
const db = require("./utils/db-connection")

const PORT = process.env.PORT||3000

const cors = require("cors")

require("./models")


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



db.sync({ alter: true }).then(() => {
console.log("db ok")
}).catch((err) => {
console.log("db  error",err)
})


app.listen(PORT, () => {
console.log("Server connected",PORT)
})