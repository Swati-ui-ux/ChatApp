import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react"

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  // get user message 
  const getMessage =async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/message", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
    console.log(data)
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
    console.log(data)
  } catch (error) {
    console.log(error)
  }
  }
  useEffect(() => {
    getAllMessage()
    getMessage()
    
  },[])

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

      // ✅ correct update
      setMessages((prev) => [...prev, res.data]);

      setInput("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message ❌");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* Header */}
      <div className="bg-purple-500 text-white p-4 text-xl font-bold">
        Chat App 💬
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="bg-white p-2 rounded shadow w-fit max-w-xs"
          >
            {msg.message}
          </div>
        ))}
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