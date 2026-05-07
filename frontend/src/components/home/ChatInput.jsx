import React from 'react'

const ChatInput = ({input,handleTyping,sendMessage}) => {
  return (
     <div className="p-4 mt-2 flex gap-2">
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
  )
}

export default ChatInput