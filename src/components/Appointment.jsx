import React, { useState } from "react";
import glasses from "../assets/glasses.png";

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    time: "",
    date: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/appointments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", time: "", date: "" });
      } else {
        const data = await response.json();
        setError(data.detail || "An error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-100 flex items-start justify-start">
      <div className="p-6 w-full flex justify-start ml-36 mt-36">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            Book an Appointment
          </h2>
          <p className="text-gray-600 mb-6">
            Please fill out the form below to schedule your appointment.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>

          {success && <p className="text-green-600 mt-4">Appointment booked successfully!</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>

        {/* Right-side section */}
        <div className="ml-20 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Why Choose Us?</h2>
          <p className="text-gray-600 mb-4">
            Experience world-class eye care and personalized service from our team.
          </p>
          <img src={glasses} alt="Glasses" className="rounded shadow-md w-full" />
        </div>
      </div>
    </div>
  );
};

export default Appointment;
