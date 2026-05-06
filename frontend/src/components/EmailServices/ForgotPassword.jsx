import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const handleSubmit = async() => {
      try {
          await axios.post("http://localhost:5000/users/forgot-password", { email })
          toast.success("Reset link set your email")
      } catch (error) {
         toast.error("Something went wrong")
      }
    }
  return (
      <div>
      <h1>Forgot Password</h1>
          <p>Enter your email to receive a reset link </p>
          <input
              required
              type="email"
              placeholder='Enter your email'
              onChange={(e)=>setEmail(e.target.value)}
          />
          <button onClick={handleSubmit} >Send reset link</button>
      </div>
  )
}

export default ForgotPassword