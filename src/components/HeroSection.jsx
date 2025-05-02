import React from 'react';
import bottomImage from '../assets/bottomImage.png'; // Adjust the path to your image

const HeroSection = () => {
  return (
    <div 
      className=" " 
      style={{ background: 'linear-gradient(to bottom, #fff, #e5e4e2 50%)' }}
    >
      <div className="text-center px-4 sm:px-8">
        <div className="mb-10 mt-36">
          <h1 className="text-4xl font-bold text-[#016c8c] sm:text-5xl">
            Welcome To VisionPro Eye Care
          </h1>
        </div>
        <p className="mt-4 text-lg text-black sm:text-2xl sm:mx-5">
          VisionPro Eye Care is committed to provide our patients with the best care and service! We offer comprehensive eye exams, contact lens fittings and training. Our doctors also use the latest technologies to manage ocular diseases such as glaucoma, dry eye disease, macular degeneration, ocular infections, and ocular allergies. Our doctors also co-manage pre- and post-operative patients with local ophthalmologists in cataract and LASIK surgeries. Call us today to schedule your appointment! We look forward to serving you!
        </p>
        <div className="mt-15 pb-36">
          <button className="mt-6 bg-[#38b4b6] text-white px-8 py-3 sm:px-12 sm:py-4 hover:bg-[#016c8c]">
            Learn More
          </button>
        </div>
      </div>
      <div className="mt-10 w-full bg-[#d4d4d4] py-4">
        <img src={bottomImage} alt="Bottom image" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default HeroSection;
