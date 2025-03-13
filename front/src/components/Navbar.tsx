import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-850 p-4">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-white text-xl-2xl font-bold">
          Home
        </Link>
        <Link to="/" className="text-white text-md-lg hover:text-gray-300">
          Mesh Viewer
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
