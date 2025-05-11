import React, { useEffect, useState } from "react";
import DoctorProfileForm from "./Doctor_profile_data_form";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine cards per page based on screen size
  const getCardsPerPage = () => {
    if (windowWidth < 640) { // Tailwind's 'sm' breakpoint
      return 1;
    } else if (windowWidth < 768) { // Tailwind's 'md' breakpoint
      return 2;
    }
    return 3;
  };

  const cardsPerPage = getCardsPerPage();
  const scrollStep = Math.min(2, cardsPerPage); // Adjust scroll step based on cards per page

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

  // Adjust index if doctors list changes
  useEffect(() => {
    if (currentIndex >= doctors.length) {
      setCurrentIndex(Math.max(0, doctors.length - cardsPerPage));
    }
  }, [doctors.length, cardsPerPage]);

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

  const nextSlide = () => {
    if (currentIndex + scrollStep < doctors.length) {
      setCurrentIndex((prev) => prev + scrollStep);
    } else if (currentIndex + 1 < doctors.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex - scrollStep >= 0) {
      setCurrentIndex((prev) => prev - scrollStep);
    } else if (currentIndex - 1 >= 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const visibleDoctors = doctors.slice(
    currentIndex,
    currentIndex + cardsPerPage
  );

  return (
    <div className="bg-gray-100 py-12 relative">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Our Doctors
      </h2>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left Arrow */}
          {currentIndex > 0 && (
            <button
              className="text-3xl text-gray-500 hover:text-gray-800 transition"
              onClick={prevSlide}
            >
              &#8592;
            </button>
          )}

          {/* Cards */}
          <div className="w-full overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out">
              {visibleDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="w-full sm:w-1/2 md:w-1/3 p-4 flex-shrink-0"
                >
                  <div className="bg-white rounded-lg shadow-md p-6 text-center h-full">
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {doctor.name}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {doctor.profession}
                    </p>
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
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          {currentIndex + cardsPerPage < doctors.length && (
            <button
              className="text-3xl text-gray-500 hover:text-gray-800 transition"
              onClick={nextSlide}
            >
              &#8594;
            </button>
          )}
        </div>
      </div>

      {/* Add Profile Button */}
      <div className="mt-12 flex justify-center">
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
          onClick={() => setShowForm(true)}
        >
          Add Your Profile
        </button>
      </div>

      {/* Modal */}
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