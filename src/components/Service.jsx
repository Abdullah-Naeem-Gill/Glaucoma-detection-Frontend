import React, { useState } from "react";
import service_background from "../assets/service_background.jpg";
import eye_exam from "../assets/eye_exam.jpg";
import glaucoma from "../assets/glaucoma.jpg";
import appointment from "../assets/appointment.png";
import BookAppointmentForm from "./Book_Appointment_form";

const Service = () => {
  const [showForm, setShowForm] = useState(false);
  const [showGlaucomaModal, setShowGlaucomaModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const openGlaucomaModal = () => {
    setShowGlaucomaModal(true);
    setPrediction(null);
    setPreviewImage(null);
    setSelectedFile(null);
    setError(null);
  };

  const closeGlaucomaModal = () => {
    setShowGlaucomaModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("http://localhost:2000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message || "An error occurred during prediction");
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen min-w-full"
      style={{
        backgroundImage: `url(${service_background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center pt-32 px-6 text-center">
        <p className="text-2xl text-black mb-2">What We Offer</p>
        <h2 className="text-3xl mb-20 font-semibold text-[#016c8c] md:text-4xl lg:text-5xl">
          Featured Services
        </h2>

        <div className="w-full flex flex-col items-center space-y-10 md:flex-row md:justify-center md:space-x-12 md:space-y-0">
          {/* Eye Exam Card */}
          <div className="w-full max-w-sm rounded-lg relative group cursor-pointer" onClick={openForm}>
            <img
              src={eye_exam}
              alt="Eye Exam"
              className="w-full h-auto object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-[rgba(56,180,182,0.5)] scale-y-0 origin-bottom group-hover:scale-y-100 rounded-3xl transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 bg-transparent text-white transition-transform duration-500 group-hover:translate-y-[-100%]">
              <p className="mb-0 text-xl font-semibold">Comprehensive</p>
              <p className="mb-4 text-xl font-semibold">Eye Exam</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="px-3 py-1 ml-34 border-2 border-white text-black bg-white rounded-full flex hover:text-black transition-all">
                  <span className="text-2xl mb-1 font-extrabold">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Glaucoma Card */}
          <div className="w-full max-w-sm rounded-lg relative group cursor-pointer" onClick={openGlaucomaModal}>
            <img
              src={glaucoma}
              alt="Glaucoma"
              className="w-full h-auto object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-[rgba(56,180,182,0.5)] scale-y-0 origin-bottom group-hover:scale-y-100 rounded-3xl transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 bg-transparent text-white transition-transform duration-500 group-hover:translate-y-[-100%]">
              <p className="mb-0 text-xl font-semibold">Glaucoma</p>
              <p className="mb-4 text-xl font-semibold">Detection</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="px-3 py-1 ml-34 border-2 border-white text-black bg-white rounded-full flex hover:text-black transition-all">
                  <span className="text-2xl mb-1 font-extrabold">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Book Appointment Card */}
          <div className="w-full max-w-sm rounded-lg relative group cursor-pointer" onClick={openForm}>
            <div className="relative">
              <img
                src={appointment}
                alt="Appointment"
                className="w-full h-auto object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-[rgba(56,180,182,0.5)] scale-y-0 origin-bottom group-hover:scale-y-100 rounded-3xl transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 bg-transparent text-white transition-transform duration-500 group-hover:translate-y-[-100%]">
                <p className="mb-0 text-xl font-semibold">Book an</p>
                <p className="mb-4 text-xl font-semibold">Appointment</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-3 py-1 ml-34 border-2 border-white text-black bg-white rounded-full flex hover:text-black transition-all">
                    <span className="text-2xl mb-1 font-extrabold">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md mx-4">
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

      {/* Glaucoma Detection Modal */}
      {showGlaucomaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md mx-4">
            <button
              onClick={closeGlaucomaModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-[#016c8c] mb-4">Glaucoma Detection</h2>

            {!prediction ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="eyeImage">
                    Upload Eye Image
                  </label>
                  <input
                    type="file"
                    id="eyeImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {previewImage && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full h-auto rounded border border-gray-300"
                    />
                  </div>
                )}

                {error && (
                  <div className="mb-4 text-red-500">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#016c8c] text-white py-2 px-4 rounded hover:bg-[#015a75] transition duration-300 disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Analyze Image"}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Result:</h3>
                <div className={`text-2xl font-bold mb-2 ${
                  prediction.prediction === "Glaucoma" ? "text-red-600" : "text-green-600"
                }`}>
                  {prediction.prediction}
                </div>
                {prediction.prediction === "Glaucoma" && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    <p>Our analysis suggests possible glaucoma. Please consult with an eye specialist for further evaluation.</p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setPrediction(null);
                    setPreviewImage(null);
                    setSelectedFile(null);
                  }}
                  className="bg-[#016c8c] text-white py-2 px-4 rounded hover:bg-[#015a75] transition duration-300"
                >
                  Analyze Another Image
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
