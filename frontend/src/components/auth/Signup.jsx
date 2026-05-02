import { useState ,useContext} from "react";
import axios from "axios";
import {  toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";

function SignUp() {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

    
    
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!formData.name || !formData.email) {
      return toast.error("Name and Email required");
    }
    console.log(formData)

    const res = await axios.post(
      "http://localhost:5000/users/signup",
      formData
    );    
    toast.success(res.data.messsage);
    // localStorage.setItem("token", res.data.token)
    // navigate("/login")
   
    setFormData({
      name: "",
      email: "",
      password: ""
    });

  } catch (error) {
    console.log(error);
    // toast.error("Error adding user");
  }
};

    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign up
        </h2>

        <input
          type="text"
                        name="name"
                        required
          placeholder="Name"
          value={formData.name}        
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="email"
                        name="email"
                        required
                        
          placeholder="Email"
          value={formData.email}       
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      
           <input
          type="password"
                        name="password"
                        required
                        
          placeholder="Password"
          value={formData.password}      
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          type="submit"
          className="w-full mb-2 bg-purple-500 text-white py-2 rounded-lg cursor-pointer hover:bg-purple-600 transition"
        >
          Add User
        </button>
  <span>Create new Account <Link to='/login' className='text-purple-600'>click</Link></span>
        
          </form>
           
           </div> 
           
</>
  );
}

export default SignUp;