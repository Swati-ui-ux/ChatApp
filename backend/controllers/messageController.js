const Message = require("../models/message");

// send messageon db
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required ❌" });
    }

    const newMessage = await Message.create({
      message,
      userId: req.user.userId,
    });

    res.status(201).json({newMessage}); // ✅ clean response
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
const getAllMessage = async (req, res)=>{
   try {
       const messages = await Message.findAll({});
       if (!messages) {
       return res.status(404).json({message:"Message not found"})
       }
       
      //  console.log(messages)
         return res.status(200).json({message:"Messages",messages})
       
       
   } catch (error) {
       console.log(error)
      return res.status(500).json({message:"server error"})
       
   }
}

module.exports = {sendMessage,getMessage,getAllMessage};