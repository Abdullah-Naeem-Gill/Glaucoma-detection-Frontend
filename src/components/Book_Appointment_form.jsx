import React, { useState } from 'react';

const Book_Appointment_form = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    email: '',
    reason: '',
    preferredTime: '',
    preferredDate1: '',
    preferredDate2: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/appointment/form/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Appointment created:', data);
        alert("Appointment submitted successfully!");

        setFormData({
          firstName: '',
          lastName: '',
          dob: '',
          phone: '',
          email: '',
          reason: '',
          preferredTime: '',
          preferredDate1: '',
          preferredDate2: '',
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit appointment');
      }
    } catch (error) {
      console.error('Submission error:', error.message);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-green-100 shadow-lg p-8 mt-12 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-800">Book an Appointment</h2>

      {/* Add scroll functionality here */}
      <div className="max-h-96 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Reason for Visit"
              required
              className="w-full p-2 border rounded h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time of Day</label>
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">First Preferred Date</label>
              <input
                type="date"
                name="preferredDate1"
                value={formData.preferredDate1}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Second Preferred Date</label>
              <input
                type="date"
                name="preferredDate2"
                value={formData.preferredDate2}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          >
            Submit Appointment Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Book_Appointment_form;
