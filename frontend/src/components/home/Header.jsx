import React from 'react'

const Header = ({name,handleLogout}) => {
  return (
     <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white p-4 flex justify-between items-center shadow">
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
  )
}

export default Header