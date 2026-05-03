const jwt = require("jsonwebtoken")
const User = require("../models/users")

module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token

      if (!token) {
        return next(new Error("Authorization token is missing"))
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await User.findByPk(decoded.userId)

      if (!user) {
        return next(new Error("User not found"))
      }

      socket.user = user
      next()
    } catch (error) {
      console.log("Socket Auth Error:", error.message)
      return next(new Error(error.message))
    }
  })
}