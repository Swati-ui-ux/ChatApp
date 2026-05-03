module.exports = (socket,io) => {
 console.log("User connected", socket.id)
    // send message
    socket.on("send_message", (data) => {
        
       console.log("User",  socket.user?.name || socket.user?.username || "Unknown",
  "said:", "said:", data.message,":-->",socket.id)
        
        // receive message
        io.emit("receive_message",data)
    })
}