const { Server } = require("socket.io")
const socketAuth = require("../socket/middleware")
const chat = require("../socket/handlers/chat")

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  })

  socketAuth(io)

  io.on("connection", (socket) => {
    chat(socket, io)
  })

  return io
}