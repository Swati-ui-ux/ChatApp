import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import Home from "./components/home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./components/EmailServices/ForgotPassword"
import ResetPassword from "./components/EmailServices/ResetPassword"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔹 Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" />

      <Routes>
        {/* Protected Route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Home setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public Routes */}
        <Route
          path="/login" isLoggedIn={isLoggedIn}
          element={
            !isLoggedIn ? (
              <Login setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isLoggedIn ? (
              <SignUp setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/reset-password/:token" element={<ResetPassword/>} />
      </Routes>
    </div>
  );
};

export default App;