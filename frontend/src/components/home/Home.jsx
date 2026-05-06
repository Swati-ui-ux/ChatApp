import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const Home = ({ setIsLoggedIn }) => {
  const [messages, setMessages] = useState([]);
  const [chatType, setChatType] = useState("personal");
  const [groupId, setGroupId] = useState("");
  const [room, setRoom] = useState("");
  const [typingUser, setTypingUser] = useState("");

  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");

  const userId = Number(localStorage.getItem("userId"));
  const name = localStorage.getItem("name");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const navigate = useNavigate();

  // Socket connect
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") },
    });

    socketRef.current = socket;

    // message receive FIXED
    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          message: data.message || data.data,
          userId: data.userId,
          name: data.name,
          createdAt: data.createdAt || new Date(),
        },
      ]);
    });

    // typing
    socket.on("show_typing", ({ name }) => {
      setTypingUser(name);
    });

    socket.on("hide_typing", () => {
      setTypingUser("");
    });

    return () => socket.disconnect();
  }, []);

  // fetch messages
  const fetchMessages = async (roomName) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/message/all?room=${roomName}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

     setMessages(
      Array.isArray(res.data)
        ? res.data
        : res.data.messages || []
    );
  } catch (err) {
    console.log(err);
    toast.error("Failed to load messages ❌");
  }
};
  
  
  
  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  Join Room
  const handleJoin = async () => {
    const socket = socketRef.current;
    const myEmail = localStorage.getItem("email");

    if (!socket) return;

    try {
      if (chatType === "personal") {
        if (!email.trim()) return toast.error("Email required");

        await axios.post("http://localhost:5000/users/check-email", {
          email,
        });

        const roomName = [myEmail, email].sort().join("_");

        setRoom(roomName);
        // setMessages([]);

        socket.emit("join-room", roomName);
        await fetchMessages(roomName)
        toast.success("Joined personal chat ✅");
      } else {
        if (!groupId.trim()) return toast.error("Group ID required");

        setRoom(groupId);
        // setMessages([]);

        socket.emit("join-room", groupId);
        await fetchMessages(groupId)
        toast.success("Joined group chat ✅");
      }
    } catch (err) {
      toast.error("Join failed ❌");
    }
  };

  // Typing handler (UNCHANGED BEHAVIOR)
  const handleTyping = (e) => {
    setInput(e.target.value);

    const socket = socketRef.current;
    if (!room || !socket) return;

    socket.emit("typing", { roomName: room, name });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", room);
    }, 1000);
  };

  // Send Message
  const sendMessage = async () => {
    const socket = socketRef.current;

    if (!input.trim()) return toast.error("Empty message ❌");
    if (!room) return toast.error("Join chat first ❌");

    try {
      await axios.post(
        "http://localhost:5000/message",
        { message: input, room, chatType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      socket.emit("new_message", {
        message: input,
        roomName: room,
        userId,
        name,
      });

      setInput("");
      socket.emit("stop_typing", room);
    } catch (err) {
      toast.error("Send failed ❌");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  // SAFE FILTER (important fix)
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  const filteredMessages = messages.filter((msg) => {
    if (!msg.createdAt) return true; // ⚠️ do not break UI
    return new Date(msg.createdAt) > twoDaysAgo;
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex justify-between items-center shadow">
        <span className="text-lg font-bold">Chat App 💬</span>

        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            👤 {name || "User"}
          </div>

          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Toggle */}
      <div className="p-2 flex gap-2 bg-white shadow rounded-lg w-fit mx-4 mt-2">
        <button
          onClick={() => setChatType("personal")}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
            chatType === "personal"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Personal
        </button>

        <button
          onClick={() => setChatType("group")}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
            chatType === "group"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Group
        </button>
      </div>

      {/* Join */}
      <div className="p-4 flex gap-2">
        {chatType === "personal" ? (
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email..."
            className="border border-gray-400 p-2 flex-1 rounded-md"
          />
        ) : (
          <input
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            placeholder="Enter group ID..."
            className="border border-gray-400 p-2 flex-1 rounded-md"
          />
        )}
        <button
          onClick={handleJoin}
          className="bg-purple-400 cursor-pointer px-6 rounded-md text-white"
        >
          Join
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* Typing */}
        {typingUser && (
          <div className="text-sm text-gray-500 italic px-2 mb-2">
            {typingUser} is typing...
          </div>
        )}

        {filteredMessages.map((msg, i) => {
          const isMe = msg.userId === userId;

          return (
            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`p-2 m-1 rounded ${
                isMe ? "bg-purple-500 text-white" : "bg-white"
              }`}>
                {msg.message}
                <div className="text-xs">{isMe ? "You" : msg.name}</div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2">
        <input
          value={input}
          onChange={handleTyping}
          className="border border-gray-400 p-2 flex-1 focus:border-pink-700 rounded-md"
        />
        <button
          onClick={sendMessage}
          className="bg-pink-500 px-6 rounded-md text-white cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;