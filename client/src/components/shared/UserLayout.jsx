
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <Header />

      <main className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
