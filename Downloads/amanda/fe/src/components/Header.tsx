import React, { useEffect, useState } from "react";
import { fetchUser } from "../utils/api";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  FaTachometerAlt,
  FaHome,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [user, setUser] = useState<{ email: string; phone: string } | null>(
    null
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    console.log(user?.email);
    const getUser = async () => {
      const user = await fetchUser();
      setUser(user);
    };
    getUser();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigation("/signin");
  };

  return (
    <header className="bg-[#4338ca] text-white p-10">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <img src="/logo_temporary.png" alt="Cancat Logo" className="h-8" />

        <button
          className="lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <RxHamburgerMenu className="w-6 h-6 text-white" />
        </button>

        <div
          className={`w-full lg:w-auto ${
            isMenuOpen ? "block" : "hidden"
          } lg:block mt-4 lg:mt-0`}
        >
          <ul className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
            <li
              className={`flex items-center ${
                window.location.pathname === "/dashboard"
                  ? "text-yellow-100"
                  : ""
              }`}
            >
              <FaTachometerAlt className="mr-2" />
              <button onClick={() => navigation("/dashboard")}>
                Dashboard
              </button>
            </li>
            <li
              className={`flex items-center ${
                window.location.pathname === "/household"
                  ? "text-yellow-100"
                  : ""
              }`}
            >
              <FaHome className="mr-2" />
              <button onClick={() => navigation("/household")}>
                Household
              </button>
            </li>
            <li
              className={`flex items-center ${
                window.location.pathname === "/settings"
                  ? "text-yellow-100"
                  : ""
              }`}
            >
              <FaCog className="mr-2" />
              <button onClick={() => navigation("/settings")}>Settings</button>
            </li>
            <li
              className={`flex items-center ${
                window.location.pathname === "/help"
                  ? "text-yellow-100"
                  : ""
              }`}
            >
              <FaQuestionCircle className="mr-2" />
              <button onClick={() => navigation("/help")}>Help</button>
            </li>
            <li className="flex items-center">
              <FaSignOutAlt className="mr-2" />
              <button onClick={handleLogout}>Log out</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;