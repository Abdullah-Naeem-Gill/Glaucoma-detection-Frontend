import React, { useEffect, useState } from "react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors from the backend API when the component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/doctors/")  // Ensure this is the correct URL
      .then((res) => res.json())
      .then((data) => {
        // Fetch images for each doctor
        const doctorsWithImages = data.map(async (doctor) => {
          const imageRes = await fetch(
            `http://127.0.0.1:8000/images/get/${doctor.id}`
          );
          const imageBlob = await imageRes.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          return { ...doctor, imageUrl };
        });
        Promise.all(doctorsWithImages).then(setDoctors);
      })
      .catch((err) => console.error("Failed to fetch doctors:", err));
  }, []);

  // Function to render stars for doctor ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-gray-100 py-12">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Our Doctors
      </h2>
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6 text-center">
            {/* Display doctor image */}
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
            <p className="text-blue-600 font-medium">{doctor.profession}</p>
            <p className="text-gray-600 mt-2">{doctor.experience} years of experience</p>
            <div className="flex justify-center mt-2 text-lg">
              {renderStars(doctor.rating)}
            </div>
            <p className="text-gray-700 mt-1">Available: {doctor.available_time}</p>
            <p className="text-gray-700">Fees: {doctor.fees}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
