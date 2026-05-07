import React from 'react'

const Message = ({ filteredMessages, messagesEndRef }) => {
     const userId = Number(localStorage.getItem("userId"));
  return (
      <div>
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
  )
}

export default Message