
import React from "react";
import { NavLink } from "react-router-dom";
import {
  IoHomeOutline,
  IoFitnessOutline,
  IoTrophyOutline,
} from "react-icons/io5";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
      isActive
        ? "bg-lime-400 text-gray-950"
        : "text-base-content/70 hover:bg-base-300"
    }`;

  return (
    <aside className="min-h-full w-64 border-r border-base-300 bg-base-100 p-5">
      <p className="mb-5 px-4 text-xs font-bold uppercase tracking-widest text-base-content/50">
        Menu
      </p>

      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={linkClass}>
          <IoHomeOutline className="text-xl" />
          Dashboard
        </NavLink>

        <NavLink to="/workouts" className={linkClass}>
          <IoFitnessOutline className="text-xl" />
          Workouts
        </NavLink>

        <NavLink to="/challenges" className={linkClass}>
          <IoTrophyOutline className="text-xl" />
          Challenges
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
