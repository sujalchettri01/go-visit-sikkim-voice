import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.1)] z-[1000] py-4 transition-all duration-200">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={closeMobileMenu}
            className="flex items-center gap-2 text-2xl font-bold text-blue-600 transition-transform duration-200 hover:scale-105 no-underline"
          >
            <span className="text-3xl">🏔️</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sikkim Tourism
            </span>
          </Link>

          {/* Navigation Menu - Desktop */}
          <ul className="hidden md:flex list-none gap-4 m-0 p-0 flex-1 justify-center">
            <Link
              to="/"
              className={`relative px-4 py-2 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-200 hover:after:w-4/5 ${
                location.pathname === "/"
                  ? "text-blue-600 bg-gray-50 after:w-4/5"
                  : ""
              }`}
            >
              Home
            </Link>
           
            <Link 
              to="/destinations" 
              className={`relative px-4 py-2 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-200 hover:after:w-4/5 ${
                location.pathname === "/destinations"
                  ? "text-blue-600 bg-gray-50 after:w-4/5"
                  : ""
              }`}
            >
              Destinations
            </Link>

            <Link 
              to="/activities" 
              className={`relative px-4 py-2 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-200 hover:after:w-4/5 ${
                location.pathname === "/activities"
                  ? "text-blue-600 bg-gray-50 after:w-4/5"
                  : ""
              }`}
            >
              Activities
            </Link>

            <Link 
              to="/cultures" 
              className={`relative px-4 py-2 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-200 hover:after:w-4/5 ${
                location.pathname === "/cultures"
                  ? "text-blue-600 bg-gray-50 after:w-4/5"
                  : ""
              }`}
            >
              Cultures
            </Link>

            <Link 
              to="/accommodations" 
              className={`relative px-4 py-2 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-200 hover:after:w-4/5 ${
                location.pathname === "/accommodations"
                  ? "text-blue-600 bg-gray-50 after:w-4/5"
                  : ""
              }`}
            >
              Hotels
            </Link>

            <Link 
              to="/contact" 
              className={`relative px-4 py-2 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-200 hover:after:w-4/5 ${
                location.pathname === "/contact"
                  ? "text-blue-600 bg-gray-50 after:w-4/5"
                  : ""
              }`}
            >
              Contact Us
            </Link>
          </ul>

          {/* Actions - Desktop */}
          <div className="hidden md:flex gap-2">
            <Link to={'/destinations'}>
             <button 
              className="group/btn relative px-6 py-2 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
            >
              <span 
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100"
              />
              <span className="relative">Book Now</span>
            </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-600 my-1 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4 bg-white/95 backdrop-blur-md border-t border-gray-100">
            <ul className="list-none m-0 p-0 space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 ${
                    location.pathname === "/"
                      ? "text-blue-600 bg-gray-50 border-l-4 border-blue-600"
                      : ""
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 ${
                    location.pathname === "/destinations"
                      ? "text-blue-600 bg-gray-50 border-l-4 border-blue-600"
                      : ""
                  }`}
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/activities"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 ${
                    location.pathname === "/activities"
                      ? "text-blue-600 bg-gray-50 border-l-4 border-blue-600"
                      : ""
                  }`}
                >
                  Activities
                </Link>
              </li>
              <li>
                <Link
                  to="/cultures"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 ${
                    location.pathname === "/cultures"
                      ? "text-blue-600 bg-gray-50 border-l-4 border-blue-600"
                      : ""
                  }`}
                >
                  Cultures
                </Link>
              </li>
              <li>
                <Link
                  to="/accommodations"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 ${
                    location.pathname === "/accommodations"
                      ? "text-blue-600 bg-gray-50 border-l-4 border-blue-600"
                      : ""
                  }`}
                >
                  Hotels
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 no-underline text-gray-600 font-medium rounded-lg transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 ${
                    location.pathname === "/contact"
                      ? "text-blue-600 bg-gray-50 border-l-4 border-blue-600"
                      : ""
                  }`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>

            {/* Mobile Book Now Button */}
            <Link to={'/destinations'} onClick={closeMobileMenu}>
             <button 
              className="w-full mt-4 px-6 py-3 rounded-xl text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-200 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
            >
              Book Now
            </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[999] md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Spacer to account for fixed navigation */}
      <div className="h-20" />
    </>
  );
};

export default Navigation;