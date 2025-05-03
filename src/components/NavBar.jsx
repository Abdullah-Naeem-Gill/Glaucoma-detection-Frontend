import React, { useState } from "react";
import calendarIcon from "../assets/calendarIcon.png"; // Adjust the path if needed
import BookAppointmentForm from "./Book_Appointment_form"; // Adjust path if needed

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Toggle mobile menu
  const [showForm, setShowForm] = useState(false); // Toggle appointment form modal

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mt-10 px-8 relative">
        {/* Navigation Links - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 space-x-6 text-[#016c8c] text-2xl md:block hidden">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact Us</a>
        </div>

        {/* Hamburger Menu (Visible on small screens) */}
        <div className="block md:hidden">
          <button onClick={toggleMenu} className="text-[#016c8c] text-2xl">
            <span className="block w-6 h-0.5 bg-[#016c8c] mb-1"></span>
            <span className="block w-6 h-0.5 bg-[#016c8c] mb-1"></span>
            <span className="block w-6 h-0.5 bg-[#016c8c]"></span>
          </button>
        </div>

        {/* Right-Aligned Button - Hidden on small screens */}
        <div className="ml-auto md:block hidden">
          <button
            onClick={openForm}
            className="bg-[#016c8c] text-white px-4 py-2 rounded-lg hover:bg-opacity-80"
          >
            REQUEST AN APPOINTMENT
          </button>
        </div>

        {/* Small Round Calendar Button - Visible only on small screens */}
        <div className="md:hidden absolute right-0 mr-10">
          <button
            onClick={openForm}
            className="bg-[#016c8c] text-white p-3 rounded-full shadow-lg hover:bg-opacity-80"
            aria-label="Calendar"
          >
            <img src={calendarIcon} alt="Calendar Icon" className="w-6 h-6" />
          </button>
        </div>

        {/* Dropdown Menu for Mobile */}
        {menuOpen && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-lg w-64 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-[#016c8c] text-xl pl-5">
                Home
              </a>
              <a href="#services" className="text-[#016c8c] text-xl pl-5">
                Services
              </a>
              <a href="#about" className="text-[#016c8c] text-xl pl-5">
                About
              </a>
              <a href="#contact" className="text-[#016c8c] text-xl pl-5">
                Contact Us
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay for Appointment Form */}
      {showForm && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={closeForm}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Close"
            >
              ✕
            </button>
            <BookAppointmentForm />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
