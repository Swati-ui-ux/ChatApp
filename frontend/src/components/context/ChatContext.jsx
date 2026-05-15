import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chatType, setChatType] = useState("personal");
  const [groupId, setGroupId] = useState("");
  const [room, setRoom] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");

  const socketRef = useRef(null);
  const typingTimeout = useRef(null);

  const userId = Number(localStorage.getItem("userId"));
  const name = localStorage.getItem("name");

  const url = 'http://localhost:3307';
  const config =  {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
  // socket connection
  useEffect(() => {
    const socket = io(`${url}`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketRef.current = socket;

    // receive message
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

    // typing event
    socket.on("show_typing", ({ name }) => {
      setTypingUser(name);
    });

    // stop typing event
    socket.on("hide_typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  
  // fetch old messages
  const fetchMessages = async (roomName) => {
    try {
      const res = await axios.get(
        `${url}/message/all?room=${roomName}`,
       config
      );

      setMessages(res.data);
    } catch (err) {
      console.log(err);
      toast.error("failed to load messages");
    }
  };

  // join room
  const handleJoin = async () => {
    const socket = socketRef.current;
    const myEmail = localStorage.getItem("email");

    if (!socket) return;

    try {
      // personal chat
      if (chatType === "personal") {
        if (!email.trim()) {
          return toast.error("email required");
        }

        await axios.post(`${url}/users/check-email`, {
          email,
        });

        const roomName = [myEmail, email].sort().join("_");

        setRoom(roomName);

        socket.emit("join-room", roomName);

        await fetchMessages(roomName);

        toast.success("joined personal chat");
      }

      // group chat
      else {
        if (!groupId.trim()) {
          return toast.error("group id required");
        }

        setRoom(groupId);

        socket.emit("join-room", groupId);

        await fetchMessages(groupId);

        toast.success("joined group chat");
      }
    } catch (err) {
      console.log(err);
      toast.error("join failed");
    }
  };

  // typing functionality
  const handleTyping = (e) => {
    setInput(e.target.value);

    const socket = socketRef.current;

    if (!room || !socket) return;

    socket.emit("typing", {
      roomName: room,
      name,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", room);
    }, 1000);
  };

  // send message
  const sendMessage = async () => {
    const socket = socketRef.current;

    if (!input.trim()) {
      return toast.error("empty message");
    }

    if (!room) {
      return toast.error("join chat first");
    }

    try {
      await axios.post(
        `${url}/message`,
        {
          message: input,
          room,
          chatType,
        },
       config
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
      console.log(err);
      toast.error("send failed");
    }
  };

  // filter last 2 days messages
  const twoDaysAgo = new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000
  );

  const filteredMessages = messages.filter((msg) => {
    if (!msg.createdAt) return true;

    return new Date(msg.createdAt) > twoDaysAgo;
  });

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        chatType,
        setChatType,
        groupId,
        setGroupId,
        room,
        setRoom,
        typingUser,
        setTypingUser,
        input,
        setInput,
        email,
        setEmail,
        handleJoin,
        handleTyping,
        sendMessage,
        filteredMessages,
        url,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
// this is costom hook use for reusing
export const useChat = () => {
  return useContext(ChatContext);
};