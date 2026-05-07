import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import JoinFunctionality from "./JoinFunctionality";
import Header from "./Header";
import Typing from "./Typing";
import Message from "./Message";
import ChatInput from "./ChatInput";

import { useChat } from "../context/ChatContext";

const Home = ({ setIsLoggedIn }) => {
  const {
    filteredMessages,
    typingUser,
    input,
    handleTyping,
    sendMessage,
    chatType,
    setChatType,
    groupId,
    setGroupId,
    handleJoin,
    email,
    setEmail,
  } = useChat();

  const navigate = useNavigate();

  const messagesEndRef = useRef(null);

  const name = localStorage.getItem("name");

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [filteredMessages]);

  // logout
  const handleLogout = () => {
    localStorage.clear();

    setIsLoggedIn(false);

    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* header */}
      <Header
        name={name}
        handleLogout={handleLogout}
      />

      {/* join functionality */}
      <JoinFunctionality
        setChatType={setChatType}
        setGroupId={setGroupId}
        handleJoin={handleJoin}
        groupId={groupId}
        chatType={chatType}
        email={email}
        setEmail={setEmail}
      />

      {/* messages */}
      <Message
        messagesEndRef={messagesEndRef}
        filteredMessages={filteredMessages}
      />

      {/* typing */}
      <Typing typingUser={typingUser} />

      {/* input */}
      <ChatInput
        input={input}
        handleTyping={handleTyping}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Home;