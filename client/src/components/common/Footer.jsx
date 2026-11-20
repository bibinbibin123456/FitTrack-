import React from "react";
import { Link } from "react-router-dom";
import { IoFitnessOutline, IoArrowUpOutline } from "react-icons/io5";

const currentYear = new Date().getFullYear();

const Footer = () => (
  <footer className="mt-12 bg-[#111820] text-white">
    <div className="mx-auto max-w-[1440px] px-5 pb-6 pt-12 sm:px-8 lg:px-10">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-lime-300 text-gray-950">
              <IoFitnessOutline className="text-2xl" />
            </span>
            <span className="text-xl font-black tracking-tight">
              FitTrack<span className="text-lime-300">.</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
            A clearer view of your movement, your nutrition, and the progress you make every day.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
            Your training
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li><Link className="hover:text-lime-300" to="/workouts">Workout log</Link></li>
            <li><Link className="hover:text-lime-300" to="/gps-tracker">GPS tracker</Link></li>
            <li><Link className="hover:text-lime-300" to="/challenges">Challenges</Link></li>
            <li><Link className="hover:text-lime-300" to="/create-challenge">Create a challenge</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
            Your wellbeing
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li><Link className="hover:text-lime-300" to="/food">Food tracker</Link></li>
            <li><Link className="hover:text-lime-300" to="/ai-coach">AI fitness coach</Link></li>
            <li><Link className="hover:text-lime-300" to="/profile">Your profile</Link></li>
            <li><Link className="hover:text-lime-300" to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">
            Keep your momentum
          </p>
          <p className="mt-2 text-sm leading-6 text-white/65">
            One workout at a time. Your next session is always a good place to begin.
          </p>
          <Link
            to="/workouts"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-lime-300"
          >
            Plan your next workout <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {currentYear} FitTrack. Progress at your own pace.</p>
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex items-center gap-1 self-start font-semibold hover:text-white sm:self-auto"
        >
          Back to top <IoArrowUpOutline />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
