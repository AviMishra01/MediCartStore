import { Link, useNavigate, useLocation } from "react-router-dom";
import { HelpCircle, Home, ArrowLeft, User } from "lucide-react";
import React from "react";

export default function DefaultNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we should show the back button.
  const showBackButton = location.pathname !== "/";

  const primaryColorClass = "text-indigo-600";
  const hoverColorClass = "hover:text-indigo-700";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur shadow-md h-16">
      <div className="container flex items-center justify-between h-full px-4">

        {/* Left Side: Back Button or Home Button */}
        <div className="w-1/3 flex justify-start">
          {showBackButton ? (
            <button
              onClick={() => navigate(-1)}
              className={`inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors ${hoverColorClass}`}
              title="Go Back"
            >
              <ArrowLeft size={22} />
            </button>
          ) : (
            <Link
              to="/"
              className={`inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors ${hoverColorClass}`}
              title="Go to Home"
            >
              <Home size={22} />
            </Link>
          )}
        </div>

        {/* Centered Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 justify-center absolute left-1/2 transform -translate-x-1/2 min-w-max"
        >
          <div className="h-8 w-8 rounded-md bg-primary/10 grid place-items-center">
            <span className="text-primary text-lg font-black">✚</span>
          </div>
          <span className="text-base font-extrabold tracking-tight text-gray-900">
            Medizo
          </span>
        </Link>

        {/* Right Side: Help Icon + Profile */}
        <div className="w-1/3 flex justify-end items-center gap-3">
          <Link
            to="/help"
            className={`inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors ${hoverColorClass}`}
            title="Help & Support"
          >
            <HelpCircle size={22} />
          </Link>

          {/* Profile Button */}
          <Link
            to="/profile"
            className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
            title="Profile"
          >
            <User size={20} className="text-gray-700 hover:text-indigo-600 transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  );
}
