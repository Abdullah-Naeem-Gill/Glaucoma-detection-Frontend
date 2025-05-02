import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-3">VisionCare</h3>
          <p className="text-gray-400">
            Your trusted partner for eye health and eyewear. Providing quality service since 2001.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
          <ul className="text-gray-400 space-y-2">
            <li>Email: support@visioncare.com</li>
            <li>Phone: +1 (800) 123-4567</li>
            <li>Location: 123 Health St, New York, NY</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} VisionCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
