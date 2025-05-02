import React from 'react';
import service_background from '../assets/service_background.jpg';
import eye_exam from '../assets/eye_exam.jpg';
import glaucoma from '../assets/glaucoma.jpg';
import appointment from '../assets/appointment.png';

const Service = () => {
  return (
    <div className="min-h-screen min-w-full" style={{ backgroundImage: `url(${service_background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="relative z-10 flex flex-col items-center justify-center pt-32 px-6 text-center">
        <p className="text-2xl text-black mb-2">What We Offer</p>
        <h2 className="text-3xl mb-20 font-semibold text-[#016c8c] md:text-4xl lg:text-5xl">
          Featured Services
        </h2>

        {/* Cards Container (flex to arrange the cards side by side) */}
        <div className="w-full flex justify-center space-x-12">
          {/* Eye Exam Card */}
          <div className="w-full max-w-sm rounded-lg relative group">
            <img
              src={eye_exam}
              alt="Eye Exam"
              className="w-full h-auto object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-[rgba(56,180,182,0.5)] opacity-0 group-hover:opacity-100 rounded-3xl duration-500 group-hover:translate-y-0 translate-y-full"></div>
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
          <div className="w-full max-w-sm rounded-lg relative group">
            <img
              src={glaucoma}
              alt="Glaucoma"
              className="w-full h-auto object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-[rgba(56,180,182,0.5)] opacity-0 group-hover:opacity-100 rounded-3xl duration-500 group-hover:translate-y-0 translate-y-full"></div>
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

          {/* Appointment Card */}
          <div className="w-full max-w-sm rounded-lg relative group">
            <img
              src={appointment}
              alt="Appointment"
              className="w-full h-auto object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-[rgba(56,180,182,0.5)] opacity-0 group-hover:opacity-100 rounded-3xl duration-500 group-hover:translate-y-0 translate-y-full"></div>
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
  );
};

export default Service;
