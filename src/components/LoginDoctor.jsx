import React, { useState } from "react";
import axios from "axios";

const LoginDoctor = ({ onClose, onSignUpClick }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      // Login API call
      const response = await axios.post(
        "http://127.0.0.1:8000/doctorauth/login",
        { email: formData.email, password: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Store all required data for chat system
      localStorage.setItem("doctor_token", response.data.access_token);
      localStorage.setItem("doctor_email", response.data.email);
      localStorage.setItem("doctor_id", response.data.doctor_id);
      localStorage.setItem("userType", "doctor");

      console.log("Doctor login successful:", {
        doctor_token: response.data.access_token,
        doctor_email: response.data.email,
        doctor_id: response.data.doctor_id,
      });

      setMessage("Login successful!");
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Doctor Login
      </h2>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
      {message && <p className="text-green-600 mb-4 text-sm">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
      <div className="text-center mt-4">
        <p className="text-gray-600 mb-2">Don't have an account?</p>
        <button
          onClick={onSignUpClick}
          className="text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Sign Up Here
        </button>
      </div>
    </div>
  );
};

export default LoginDoctor;
