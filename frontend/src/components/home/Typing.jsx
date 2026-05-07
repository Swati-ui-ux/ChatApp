import React from 'react'

const Typing = ({typingUser}) => {
  return (
     <div className="flex-1 overflow-y-auto p-8">

        {/* Typing */}
        {typingUser && (
          <div className="text-sm text-gray-500 italic mb-2">
            {typingUser} is typing...
          </div>
        )}
       
      </div>
  )
}

export default Typing