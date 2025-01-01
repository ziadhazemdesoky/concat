import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4338ca] text-white p-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        {/* Left side links */}
        <div className="mb-4 md:mb-0">
          <ul className="flex space-x-4">
            <li>
              <a href="/help" className="hover:text-yellow-100">Help</a>
            </li>
            <li className="before:content-['|'] before:mx-4">
              <a href="/about" className="hover:text-yellow-100">About Us</a>
            </li>
            <li className="before:content-['|'] before:mx-4">
              <a href="/security" className="hover:text-yellow-100">Data Security</a>
            </li>
          </ul>
        </div>

        {/* Right side company info */}
        <div className="text-right">
          <p>CanCat LLC</p>
          <p>P.O. Box 11218</p>
          <p>Elkins Park, PA 19027</p>
          <a href="mailto:hello@cancat.io" className="hover:text-yellow-100">
            hello@cancat.io
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;