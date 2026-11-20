import React, { useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export const DarkMode = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("fittrack-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fittrack-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle h-10 min-h-10 w-10 text-base-content/70 hover:bg-base-200"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? (
        <IoSunnyOutline className="text-xl" />
      ) : (
        <IoMoonOutline className="text-xl" />
      )}
    </button>
  );
};
