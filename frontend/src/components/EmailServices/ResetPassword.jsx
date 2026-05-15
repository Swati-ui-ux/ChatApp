import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useChat } from "../context/ChatContext"

function ResetPassword() {
  const { token } = useParams();
  const {url} = useChat()
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
const navigate = useNavigate()
  const handleSubmit = async () => {
    try {
      await axios.post(
        `${url}/users/reset-password/${token}`,
        { password }
        );
        navigate("/")
      alert("Password updated successfully");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-87.5">

        <h2 className="text-2xl font-bold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your new password below
        </p>

        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mb-4">
          <input
            type={show ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="cursor-pointer ml-2"
            onClick={() => setShow(!show)}
          >
            {show ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Update Password
        </button>

      </div>

    </div>
  );
}

export default ResetPassword;