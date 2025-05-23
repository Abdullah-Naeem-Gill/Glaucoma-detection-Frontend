import React, { useState } from 'react';

const PatientLogin = ({ onClose, onSignUpClick }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/patientauth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('patient_email', formData.email);
        const patientRes = await fetch(`http://127.0.0.1:8000/patientauth/by-email/${formData.email}`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        if (patientRes.ok) {
          const patientData = await patientRes.json();
          localStorage.setItem('patient_id', patientData.id);
          localStorage.setItem('userType', 'patient');
        }
        console.log('Patient login successful:', { access_token: data.access_token, patient_email: formData.email, patient_id: localStorage.getItem('patient_id') });
        setMessage('Login successful!');
        setTimeout(onClose, 1500);
      } else {
        const error = await response.json();
        setMessage(error.detail || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred during login');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Patient Login</h2>
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
        <button onClick={onSignUpClick} className="text-blue-600 hover:text-blue-800">
          Don't have an account? Sign up
        </button>
      </div>
      {message && (
        <p className={`mt-4 text-center ${message.includes('failed') ? 'text-red-600' : 'text-green-600'} font-medium`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default PatientLogin;