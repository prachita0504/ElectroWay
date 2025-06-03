import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-green-400 select-none">
        ElectroWay
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-300 select-none">
          Welcome, <span className="text-green-400 font-semibold">{username}</span>
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
