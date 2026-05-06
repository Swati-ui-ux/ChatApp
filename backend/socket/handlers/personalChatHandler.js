module.exports = (socket, io) => {
  console.log("User connected", socket.id);

  //  Join room
  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log("Joined room:", roomName);
  });
  
  
  // typing start
  socket.on("typing", ({ roomName, name }) => {
    socket.to(roomName).emit("show_typing", { name });
  })
  // typing stop
  socket.on("stop_typing", (roomName) => {
    socket.to(roomName).emit("hide_typing");
  })
  
  // Receive new message from frontend
  socket.on("new_message", ({ message, roomName, userId, name }) => {
    console.log("Message:", message, "Room:", roomName);

    //Send to all users in that room
    io.to(roomName).emit("receive_message", {
      message,
      userId,
      name,
      createdAt: new Date()
    });
  });

};