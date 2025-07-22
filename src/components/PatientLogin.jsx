import React, { useState } from "react";

const PatientLogin = ({ onClose, onSignUpClick }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous message on new submit
    try {
      const response = await fetch("http://127.0.0.1:8000/patientauth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        // Store all required data for chat system
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("patient_email", data.email);
        localStorage.setItem("patient_id", data.patient_id);
        localStorage.setItem("userType", "patient");

        console.log("Patient login successful:", {
          access_token: data.access_token,
          patient_email: data.email,
          patient_id: data.patient_id,
        });

        setMessage("Login successful!");
        setTimeout(onClose, 1500);
      } else {
        const error = await response.json();
        setMessage(error.detail || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred during login");
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Patient Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Email</label>
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
          <label className="block text-gray-700">Password</label>
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
      <div className="mt-4 text-center">
        <button
          onClick={onSignUpClick}
          className="text-blue-600 hover:text-blue-800"
        >
          Don't have an account? Sign up
        </button>
      </div>
      {message && (
        <p
          className={`mt-4 text-center ${
            message.toLowerCase().includes("failed") ||
            message.toLowerCase().includes("error")
              ? "text-red-600"
              : "text-green-600"
          } font-medium`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default PatientLogin;
