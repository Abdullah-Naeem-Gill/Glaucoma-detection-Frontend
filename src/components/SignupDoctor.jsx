import React, { useState } from 'react';
import axios from 'axios';

const SignupDoctor = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    specialization: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8000/doctorauth/signup',
        {
          email: formData.email,
          name: formData.name,
          specialization: formData.specialization,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setSuccessMessage(`Signup successful! Welcome, Dr. ${response.data.name}`);
      setFormData({ email: '', name: '', specialization: '', password: '' });

      if (onSignupSuccess) {
        onSignupSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-[#016c8c]">Doctor Signup</h2>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4 text-sm">{successMessage}</p>}

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

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#016c8c]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Specialization</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
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
          className="w-full bg-[#016c8c] text-white py-2 rounded hover:bg-opacity-90 transition-colors duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupDoctor;