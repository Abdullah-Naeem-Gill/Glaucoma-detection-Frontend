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

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const today = new Date().toISOString().split("T")[0];

    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!emailRegex.test(formData.email)) errors.email = "Invalid email address.";
    if (!phoneRegex.test(formData.phone)) errors.phone = "Phone must be 10 digits.";
    if (!formData.time) errors.time = "Time is required.";
    if (!formData.date) errors.date = "Date is required.";
    else if (formData.date < today) errors.date = "Date cannot be in the past.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

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
        setFormErrors({});
      } else {
        const data = await response.json();
        setError(data.detail || "An error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-100 flex flex-col md:flex-row items-start justify-start p-6 md:p-12">
      {/* Left form section */}
      <div className="w-full md:max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">
          Book an Appointment
        </h2>
        <p className="text-gray-600 mb-6">
          Please fill out the form below to schedule your appointment.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            {formErrors.name && <p className="text-red-600 text-sm">{formErrors.name}</p>}
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            {formErrors.email && <p className="text-red-600 text-sm">{formErrors.email}</p>}
          </div>

          <div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone (10 digits)"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            {formErrors.phone && <p className="text-red-600 text-sm">{formErrors.phone}</p>}
          </div>

          <div>
            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            {formErrors.time && <p className="text-red-600 text-sm">{formErrors.time}</p>}
          </div>

          <div>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            {formErrors.date && <p className="text-red-600 text-sm">{formErrors.date}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>

        {success && (
          <p className="text-green-600 mt-4">
            Appointment booked successfully!
          </p>
        )}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>

      {/* Right-side section (hidden on small devices) */}
      <div className="hidden md:block ml-0 md:ml-20 mt-10 md:mt-0 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Why Choose Us?</h2>
        <p className="text-gray-600 mb-4">
          Experience world-class eye care and personalized service from our team.
        </p>
        <img src={glasses} alt="Glasses" className="rounded shadow-md w-full" />
      </div>
    </div>
  );
};

export default Appointment;
