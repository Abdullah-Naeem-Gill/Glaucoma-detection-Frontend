import React, { useEffect, useState } from "react";
import DoctorProfileForm from "./Doctor_profile_data_form"; // Adjust the path if needed

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/doctors/")
      .then((res) => res.json())
      .then((data) => {
        const doctorsWithImages = data.map(async (doctor) => {
          try {
            const imageRes = await fetch(
              `http://127.0.0.1:8000/images/get/${doctor.id}`
            );
            const imageBlob = await imageRes.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            return { ...doctor, imageUrl };
          } catch (err) {
            return { ...doctor, imageUrl: "" };
          }
        });
        Promise.all(doctorsWithImages).then(setDoctors);
      })
      .catch((err) => console.error("Failed to fetch doctors:", err));
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-gray-100 py-12 relative">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Our Doctors
      </h2>
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              {doctor.name}
            </h3>
            <p className="text-blue-600 font-medium">{doctor.profession}</p>
            <p className="text-gray-600 mt-2">
              {doctor.experience} years of experience
            </p>
            <div className="flex justify-center mt-2 text-lg">
              {renderStars(doctor.rating)}
            </div>
            <p className="text-gray-700 mt-1">
              Available: {doctor.available_time}
            </p>
            <p className="text-gray-700">Fees: {doctor.fees}</p>
          </div>
        ))}
      </div>

      {/* Add your profile button at the bottom */}
      <div className="mt-12 flex justify-center">
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
          onClick={() => setShowForm(true)}
        >
          Add Your Profile
        </button>
      </div>

      {/* Modal for form */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-[1px] backdrop-brightness-95 bg-white/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <DoctorProfileForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
