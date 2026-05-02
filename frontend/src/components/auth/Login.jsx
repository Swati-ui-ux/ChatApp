import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom'

import { toast } from 'react-toastify'
const Login = ({setIsLoggedIn}) => {

  
 const navigate =  useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/users/login",
      formData
    );

    localStorage.setItem("token", res.data.token);
    console.log(res)
    toast.success(res.data.message);
    setIsLoggedIn(true);

    navigate("/")
   setFormData({
    email: "",
    password: ""
   })
  

  } catch (error) {
    console.log(error);
    toast.error("Login failed ❌");
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <input
          type="email"
                  name="email"
                  required
          placeholder="Enter email"
          onChange={handleChange}
          className="w-full p-3 focus:border-none mb-4 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 "
        />

        <input
          type="password"
                  name="password"
                  required
          placeholder="Enter password"
          onChange={handleChange}
          className="w-full p-3 mb-4 border  border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

       <span>Forgot password <Link to='/forgot-password' className='text-purple-600'>click</Link></span>
        <button
          type="submit"
                  className="w-full mt-2 mb-2 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition cursor-pointer  duration-200"
                  onClick={handleSubmit}
        >
          Login
        </button>
        <span>Create new Account <Link to='/signup' className='text-purple-600'>click</Link></span>
      </form>
      
    </div>
  )
}

export default Login