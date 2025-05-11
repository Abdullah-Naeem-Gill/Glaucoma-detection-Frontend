import React, { useState } from "react";
import axios from "axios";

const LoginDoctor = ({ onClose, onSignUpClick }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setToken("");

    try {
      const response = await axios.post(
        "http://localhost:8000/doctorauth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setToken(response.data.access_token);
      localStorage.setItem("doctor_token", response.data.access_token);
      // Close the modal after successful login
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-[#016c8c]">
        Doctor Login
      </h2>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      {token && (
        <p className="text-green-500 mb-4 text-sm">Login successful!</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#016c8c]"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#016c8c]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#016c8c] text-white py-2 rounded hover:bg-opacity-90 transition-colors duration-200 mb-4"
        >
          Log In
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-600 mb-2">Don't have an account?</p>
        <button
          onClick={onSignUpClick}
          className="text-[#016c8c] hover:text-[#014d63] font-medium transition-colors duration-200"
        >
          Sign Up Here
        </button>
      </div>
    </div>
  );
};

export default LoginDoctor;