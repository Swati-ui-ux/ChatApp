const Message = require("../models/message");
const User = require('../models/users')
// send messageon db
const sendMessage = async (req, res) => {
  try {
    const { message, chatType, room } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required ❌" });
    }

    console.log("REQ.USER:", req.user); //  debug

    const newMessage = await Message.create({
      message,
      room,
      chatType,
      userId: req.user.userId, // correct
    });

    res.status(201).json({ newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

// getMessage specific user
const getMessage = async(req,res) => {
try {
    const message = await Message.findAll({
        where: { userId: req.user.userId },
order:[['createdAt','ASC']]
    })
    if (!message) {
    return  res.status(404).json({ message: "message not found" });
    }
    console.log(message)
      res.status(200).json(message);
  
} catch (error) {
    console.log(error)
      res.status(500).json({ message: "server error" });
  
}
}

// get all db message
const getAllMessage = async (req, res) => {
  try {
    const { room } = req.query;

    const messages = await Message.findAll({
      where: { room },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

   const formattedMessages = messages.map((msg) => ({
  message: msg.message,
  userId: msg.userId,
  name: msg.User?.name || "Unknown",
  createdAt: msg.createdAt,
}));

    console.log("DEBUG:", formattedMessages);

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
}

module.exports = {sendMessage,getMessage,getAllMessage};