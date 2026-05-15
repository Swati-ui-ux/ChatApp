import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useChat } from '../context/ChatContext'

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
const {url} = useChat()
  const handleSubmit = async () => {
    try {
      await axios.post(
        `${url}/users/forgot-password`,
        { email }
      )

      toast.success("Reset link sent to your email")
    } catch (error) {
        // console.log(error.response.data.message)

  toast.error(error.response.data.message)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      
      <div className='bg-white w-full max-w-md rounded-2xl shadow-2xl p-8'>
        
        <h1 className='text-3xl font-bold text-center text-gray-800 mb-3'>
          Forgot Password
        </h1>

        <p className='text-gray-500 text-center mb-6'>
          Enter your email to receive a reset link
        </p>

        <input
          required
          type="email"
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 mb-5'
        />

        <button
          onClick={handleSubmit}
          className='w-full bg-linear-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300'
        >
          Send Reset Link
        </button>

      </div>

    </div>
  )
}

export default ForgotPassword