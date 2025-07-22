import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Service from "./components/Service";
import Appointment from "./components/Appointment";
import Footer from "./components/Footer";
import Doctors from "./components/Doctors";
import ChatBot from "./components/ChatBot";
import React, { useState } from "react";
import DoctorInbox from "./components/DoctorInbox";
import ChatModal from "./components/ChatModal";

const App = () => {
  const [showInbox, setShowInbox] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const userType = localStorage.getItem("userType");

  const handleOpenInbox = () => setShowInbox(true);
  const handleCloseInbox = () => setShowInbox(false);
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowInbox(false);
  };
  const handleCloseChat = () => setSelectedPatient(null);

  return (
    <div>
      <Header />
      {/* Show Inbox button for doctors */}
      {userType === "doctor" && (
        <button
          className="fixed bottom-2 left-8 z-50 bg-gradient-to-br from-blue-600 to-blue-400 text-white p-5 rounded-full shadow-2xl hover:scale-110 hover:shadow-blue-400/50 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300"
          style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
          onClick={handleOpenInbox}
          aria-label="Open Inbox"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07A1 1 0 013 19.13l1.07-4.28A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="sr-only">Inbox</span>
        </button>
      )}
      <HeroSection />
      <Service />
      <ChatBot />
      <Appointment />
      <Doctors />
      <Footer />
      {/* Doctor Inbox Modal */}
      {showInbox && (
        <DoctorInbox
          onSelectPatient={handleSelectPatient}
          onClose={handleCloseInbox}
        />
      )}
      {/* Chat Modal for doctor-patient chat */}
      {selectedPatient && (
        <ChatModal doctor={selectedPatient} onClose={handleCloseChat} />
      )}
    </div>
  );
};

export default App;
