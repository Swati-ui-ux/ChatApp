import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react"
import {io} from "socket.io-client"


const Home = () => {
  const [messages, setMessages] = useState([]);
  const userId = Number(localStorage.getItem("userId"));
  const [input, setInput] = useState("");
 const [email,setEmail] = useState('')  

  // new socket 
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem('token')
      }
    })

    setSocket(newSocket)
    return () => {
    newSocket.disconnect()
    }
  },[])
  
  // get user message 
  const getMessage =async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/message", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
    })
   
    // console.log(data)
  } catch (error) {
    console.log(error)
  }
  }
  
  const getAllMessage =async () => {
   try {
    const { data } = await axios.get("http://localhost:5000/message/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
    // console.log(data)
  } catch (error) {
    console.log(error)
  }
  }

  
  
  const sendMessage = async () => {
    if (!input.trim()) {
      return toast.error("Message cannot be empty ❌");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/message",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

     
      setMessages((prev) => [...prev, res.newMessage]);
      // socket emit to real-time  send data by socket
      socket.emit("send_message",res.data.newMessage)
 
      setInput("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message ❌");
    }
  };

  
  useEffect(() => {
  if (!socket) return;

  const handler = (data) => {
    setMessages((prev) => [...prev, data]);
  };

  socket.on("receive_message", handler);

  return () => {
    socket.off("receive_message", handler);
  };
}, [socket]); 
  // useEffect(() => {
  //  getAllMessage()
  //   getMessage()
  // },[])
  
  
  const handleSend = () => {
  console.log("Email:", email);

  if (!email.trim()) {
    alert("Email required ❌");
    return;
  }
setEmail("")
  // API call ya kuch bhi kaam yaha karo
};
  
  return (
    <div className=" h-screen bg-gray-100">
      
      {/* Header */}
      <div className="bg-purple-500 text-white p-4 text-xl font-bold">
        Chat App 💬
      </div>
      <input
        className=" mt-2 border p-2 rounded"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        type="text"
        placeholder="Enter email" />
      <button
        onClick={handleSend}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Send
        </button>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => {
          if (!msg) return null;
  const isMe = msg.userId === userId;

  return (
    <div
      key={i}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`p-2 rounded shadow max-w-xs ${
          isMe
            ? "bg-purple-500 text-white"
            : "bg-white text-black"
        }`}
      >
        {msg.message}
      </div>
    </div>
  );
})}
      </div>

      {/* Input */}
      <div className="p-4 bg-white flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;