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
        <div className="flex justify-end p-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleOpenInbox}
          >
            Inbox
          </button>
        </div>
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
