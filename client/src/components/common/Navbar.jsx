
import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="navbar border-b border-base-300 bg-base-100 px-4 md:px-10">
      {/* Logo */}
      <div className="flex-1">
        <Link
          to="/dashboard"
          className="text-2xl font-extrabold"
        >
          FitTrack <span className="text-lime-400">.</span>
        </Link>
      </div>

      {/* Navigation links */}
      <div className="hidden items-center gap-6 md:flex">
        <Link to="/dashboard" className="link-hover">
          Dashboard
        </Link>

        <Link to="/workouts" className="link-hover">
          Workouts
        </Link>

        <Link to="/challenges" className="link-hover">
          Challenges
        </Link>
      </div>

      {/* Dark mode toggle */}
      {/* <div className="ml-4">
        <DarkMode />
      </div> */}

      {/* Logout */}
      <div className="ml-4">
        <Link to="/login" className="btn btn-outline btn-sm">
          Logout
        </Link>
      </div>
    </div>
  );
};
