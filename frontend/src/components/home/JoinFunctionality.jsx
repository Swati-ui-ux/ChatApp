import React from 'react'

const JoinFunctionality = ({chatType,setChatType,groupId,email,handleJoin,setEmail,setGroupId}) => {
    return (
        <>
    {/* Toggle */}
      <div className="p-2 flex gap-2 bg-white shadow rounded-lg w-fit mx-4 mt-2">
        <button
          onClick={() => setChatType("personal")}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
            chatType === "personal"
              ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Personal
        </button>

        <button
          onClick={() => setChatType("group")}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
            chatType === "group"
              ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow"
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

        </>
  )
}

export default JoinFunctionality