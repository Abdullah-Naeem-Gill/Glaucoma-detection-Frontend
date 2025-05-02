import React, { useState, useEffect } from 'react';
import NavBar from './NavBar'; // Importing NavBar component
import background from '../assets/background.jpg';
import slider2 from '../assets/slider2.jpg';  // Import the second image
import slider3 from '../assets/slider3.jpg';  // Import the third image

const Header = () => {
  // State to control which image is displayed
  const [currentImage, setCurrentImage] = useState(1);
  const [imageClass, setImageClass] = useState('fade-in'); // Add state for fade-in effect

  useEffect(() => {
    const interval = setInterval(() => {
      setImageClass('fade-out'); // Trigger fade-out before changing the image
      setTimeout(() => {
        // Change the image after fade-out and then fade-in again
        setCurrentImage((prev) => (prev === 3 ? 1 : prev + 1));
        setImageClass('fade-in'); // Trigger fade-in after the image changes
      }, 500); // Delay to let fade-out complete
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Get the image source based on the current image
  const getImage = () => {
    if (currentImage === 1) {
      return background;
    } else if (currentImage === 2) {
      return slider2;
    } else if (currentImage === 3) {
      return slider3;
    }
  };

  return (
    <div className="h-screen relative">
      {/* Background Image or Slider */}
      <div
        className={`w-full h-full ${imageClass}`} // Add fade-in/out class here
        style={{
          background: `url(${getImage()}) no-repeat center center/cover`,
          transition: 'background-image 0.5s ease-in-out', // Smooth transition
        }}
      ></div>

      {/* Navbar positioned on top of the background */}
      <div className="absolute top-0 left-0 w-full">
        <NavBar />
      </div>

      {/* Text on top of the background */}
      <div className="absolute top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center text-black md:block hidden">
        <h1 className="text-4xl font-semibold">BETTER EYES FOR A BETTER LIFE</h1>
        <button className="bg-[#016c8c] mt-10 text-white px-4 py-2  hover:bg-opacity-80">
          REQUEST AN APPOINTMENT
        </button>
      </div>
    </div>
  );
};

export default Header;
