import React from "react";
import glasses from "../assets/glasses.png"; // adjust extension if needed

const Appointment = () => {
  return (
    <div className="min-h-screen w-full bg-blue-100 flex items-start justify-start">
      <div className="p-6 w-full flex justify-start ml-36 mt-36">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            Book an Appointment
          </h2>
          <p className="text-gray-600 mb-6">
            Please fill out the form below to schedule your appointment. We'll get
            back to you as soon as possible.
          </p>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="time"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right-side section */}
        <div className="ml-20 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Why Choose Us?</h2>
          <p className="text-gray-600 mb-4">
            Experience world-class eye care and personalized service from our dedicated team.
          </p>
          <img src={glasses} alt="Glasses" className="rounded shadow-md w-full" />
        </div>
      </div>
    </div>
  );
};

export default Appointment;
