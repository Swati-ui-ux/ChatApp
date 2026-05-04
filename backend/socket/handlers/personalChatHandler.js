module.exports = (socket,io) => {
 console.log("User connected", socket.id)
    socket.on("join-room", (roomName) => {
        socket.join(roomName)
        // console.log(roomName)
    })
    socket.on("new_message", ({data,roomName}) => {
        io.to(roomName).emit("receive_message",{userName:socket.user.name,userId:socket.user.id,data})
    })
}
