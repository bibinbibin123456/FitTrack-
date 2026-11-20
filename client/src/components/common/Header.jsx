import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  IoMenu,
  IoClose,
  IoGridOutline,
  IoFitnessOutline,
  IoTrophyOutline,
  IoLocationOutline,
  IoNutritionOutline,
  IoCalculatorOutline,
  IoSparklesOutline,
  IoPersonCircleOutline,
  IoAddOutline,
  IoLogOutOutline,
} from "react-icons/io5";

import { DarkMode } from "../shared/DarkMode";
import { clearUser } from "../../redux/features/userSlice";
import { userLogout } from "../../services/userServices";
import { toast } from "react-toastify";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: IoGridOutline },
  { to: "/workouts", label: "Workouts", icon: IoFitnessOutline },
  { to: "/challenges", label: "Challenges", icon: IoTrophyOutline },
  { to: "/gps-tracker", label: "GPS tracker", icon: IoLocationOutline },
  { to: "/food", label: "Nutrition", icon: IoNutritionOutline },
  { to: "/calorie-calculator", label: "Calorie calculator", icon: IoCalculatorOutline },
  { to: "/ai-coach", label: "AI coach", icon: IoSparklesOutline },
];

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await userLogout();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Could not contact the server to end your session."
      );
    }
    localStorage.removeItem("token");
    dispatch(clearUser());
    closeMenu();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${
      isActive
        ? "bg-base-200 text-base-content"
        : "text-base-content/65 hover:bg-base-200/70 hover:text-base-content"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-base-300/70 bg-base-100/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          className="btn btn-ghost btn-square -ml-2 xl:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
        </button>

        <NavLink
          to="/dashboard"
          onClick={closeMenu}
          className="flex min-w-fit items-center gap-2.5"
          aria-label="FitTrack home"
        >
          <img
            src="/images/fittrack-navbar.png"
            alt=""
            className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
          />
          <span>
            <span className="block text-lg font-black leading-5 tracking-tight">
              FitTrack<span className="text-lime-500">.</span>
            </span>
            <span className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.2em] text-base-content/45 sm:block">
              Move with purpose
            </span>
          </span>
        </NavLink>

        <nav className="mx-auto hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex min-w-fit items-center gap-2">
          <DarkMode />
          <NavLink
            to="/profile"
            className="hidden items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold hover:bg-base-200 md:flex"
          >
            <IoPersonCircleOutline className="text-2xl text-base-content/70" />
            <span className="max-w-24 truncate">{user?.name?.split(" ")[0] || "Profile"}</span>
          </NavLink>
          <NavLink
            to="/workouts"
            aria-label="Start training"
            className="btn hidden min-h-11 rounded-full border-0 bg-gray-950 px-3 text-white hover:bg-gray-800 lg:px-5 sm:inline-flex"
          >
            <IoAddOutline className="text-lg" />
            <span className="hidden lg:inline">Start training</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            className="btn btn-ghost hidden min-h-10 rounded-full px-2 text-error hover:bg-error/10 sm:inline-flex lg:px-3"
          >
            <IoLogOutOutline className="text-lg" />
            <span className="hidden lg:inline">Sign out</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-base-300 bg-base-100 p-4 shadow-xl xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-3">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-gray-950 text-white"
                      : "bg-base-200/70 text-base-content hover:bg-base-200"
                  }`
                }
              >
                <Icon className="text-lg" />
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/create-challenge"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-xl bg-base-200/70 px-3 py-3 text-sm font-semibold"
            >
              <IoAddOutline className="text-lg" />
              Create challenge
            </NavLink>
            <NavLink
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-xl bg-base-200/70 px-3 py-3 text-sm font-semibold"
            >
              <IoPersonCircleOutline className="text-lg" />
              {user?.name || "Profile"}
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-base-200/70 px-3 py-3 text-left text-sm font-semibold text-error"
            >
              Sign out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
