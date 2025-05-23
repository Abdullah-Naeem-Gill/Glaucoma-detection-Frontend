import React, { useState } from "react";
import calendarIcon from "../assets/calendarIcon.png";
import BookAppointmentForm from "./Book_Appointment_form";
import LoginDoctor from "./LoginDoctor";
import SignupDoctor from "./SignupDoctor";
import PatientLogin from "./PatientLogin";
import PatientSignup from "./PatientSignup";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDoctorLogin, setShowDoctorLogin] = useState(false);
  const [showDoctorSignup, setShowDoctorSignup] = useState(false);
  const [showPatientLogin, setShowPatientLogin] = useState(false);
  const [showPatientSignup, setShowPatientSignup] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const openDoctorLogin = () => {
    setShowDoctorLogin(true);
    setMenuOpen(false);
  };

  const closeDoctorLogin = () => {
    setShowDoctorLogin(false);
  };

  const openDoctorSignup = () => {
    setShowDoctorSignup(true);
    setShowDoctorLogin(false);
  };

  const closeDoctorSignup = () => {
    setShowDoctorSignup(false);
  };

  const openPatientLogin = () => {
    setShowPatientLogin(true);
    setMenuOpen(false);
  };

  const closePatientLogin = () => {
    setShowPatientLogin(false);
  };

  const openPatientSignup = () => {
    setShowPatientSignup(true);
    setShowPatientLogin(false);
  };

  const closePatientSignup = () => {
    setShowPatientSignup(false);
  };

  const handleDoctorSignupSuccess = () => {
    closeDoctorSignup();
    openDoctorLogin();
  };

  const handlePatientSignupSuccess = () => {
    closePatientSignup();
    openPatientLogin();
  };

  return (
    <>
      <div className="flex items-center justify-between mt-10 px-8 relative">
        {/* Login Buttons - Left Side */}
        <div className="mr-auto hidden md:flex space-x-4">
          <button
            onClick={openDoctorLogin}
            className="text-[#016c8c] px-4 py-2 rounded-lg hover:bg-[#016c8c] hover:text-white hover:bg-opacity-100 border border-[#016c8c] transition-colors duration-200"
          >
            Login as Doctor
          </button>
          <button
            onClick={openPatientLogin}
            className="text-[#016c8c] px-4 py-2 rounded-lg hover:bg-[#016c8c] hover:text-white hover:bg-opacity-100 border border-[#016c8c] transition-colors duration-200"
          >
            Login as Patient
          </button>
        </div>

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
            className="text-[#016c8c] px-4 py-2 rounded-lg hover:bg-[#016c8c] hover:text-white hover:bg-opacity-100 border border-[#016c8c] transition-colors duration-200 font-semibold"
          >
            REQUEST AN APPOINTMENT
          </button>
        </div>

        {/* Small Round Calendar Button - Visible only on small screens */}
        <div className="md:hidden absolute right-0 mr-10">
          <button
            onClick={openForm}
            className="bg-[#016c8c] text-white p-3 rounded-full shadow-lg hover:bg-opacity-80 transition-colors duration-200"
            aria-label="Calendar"
          >
            <img src={calendarIcon} alt="Calendar Icon" className="w-6 h-6" />
          </button>
        </div>

        {/* Dropdown Menu for Mobile */}
        {menuOpen && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-lg w-64 py-4 md:hidden z-50">
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
              <button
                onClick={openDoctorLogin}
                className="text-[#016c8c] text-xl pl-5 text-left hover:bg-[#016c8c] hover:text-white hover:bg-opacity-100 px-2 py-1 rounded transition-colors duration-200"
              >
                Login as Doctor
              </button>
              <button
                onClick={openPatientLogin}
                className="text-[#016c8c] text-xl pl-5 text-left hover:bg-[#016c8c] hover:text-white hover:bg-opacity-100 px-2 py-1 rounded transition-colors duration-200"
              >
                Login as Patient
              </button>
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
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl transition-colors duration-200"
              aria-label="Close"
            >
              ✕
            </button>
            <BookAppointmentForm />
          </div>
        </div>
      )}

      {/* Modal Overlay for Doctor Login */}
      {showDoctorLogin && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={closeDoctorLogin}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl transition-colors duration-200"
              aria-label="Close"
            >
              ✕
            </button>
            <LoginDoctor onClose={closeDoctorLogin} onSignUpClick={openDoctorSignup} />
          </div>
        </div>
      )}

      {/* Modal Overlay for Doctor Signup */}
      {showDoctorSignup && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={closeDoctorSignup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl transition-colors duration-200"
              aria-label="Close"
            >
              ✕
            </button>
            <SignupDoctor onSignupSuccess={handleDoctorSignupSuccess} />
          </div>
        </div>
      )}

      {/* Modal Overlay for Patient Login */}
      {showPatientLogin && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={closePatientLogin}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl transition-colors duration-200"
              aria-label="Close"
            >
              ✕
            </button>
            <PatientLogin onClose={closePatientLogin} onSignUpClick={openPatientSignup} />
          </div>
        </div>
      )}

      {/* Modal Overlay for Patient Signup */}
      {showPatientSignup && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={closePatientSignup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl transition-colors duration-200"
              aria-label="Close"
            >
              ✕
            </button>
            <PatientSignup onSignupSuccess={handlePatientSignupSuccess} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;