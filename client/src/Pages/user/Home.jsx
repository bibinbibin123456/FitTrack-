import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoArrowForward,
  IoFitnessOutline,
} from "react-icons/io5";

const onboardingSlides = [
  {
    image: "/images/running-community.jpg",
    label: "01 / RUN WITH PURPOSE",
    title: <>MAKE YOUR<br />MILES <span className="text-lime-300">MATTER.</span></>,
    description:
      "Log everyday runs, follow your pace, and see your consistency grow.",
  },
  {
    image: "/images/everyday-walkers.jpg",
    label: "02 / KEEP YOUR ROUTINE",
    title: <>EVERY STEP<br /><span className="text-lime-300">COUNTS.</span></>,
    description:
      "Walk, move, and build a routine that feels good enough to keep.",
  },
  {
    image: "/images/balanced-meal.jpg",
    label: "03 / FUEL YOUR MOVEMENT",
    title: <>EAT WELL.<br /><span className="text-lime-300">MOVE WELL.</span></>,
    description:
      "Track meals and get clear calorie guidance to support your everyday training.",
  },
];

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const slide = onboardingSlides[activeSlide];
  const isLastSlide = activeSlide === onboardingSlides.length - 1;

  const goNext = () => {
    if (isLastSlide) {
      navigate("/login");
      return;
    }

    setActiveSlide((current) => current + 1);
  };

  const goBack = () => {
    setActiveSlide((current) => Math.max(current - 1, 0));
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#101114] text-white">
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5" aria-label="FitTrack home">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-lime-400 text-gray-950">
            <IoFitnessOutline className="text-2xl" />
          </span>
          <span className="text-xl font-black tracking-tight">
            FIT<span className="text-lime-400">TRACK</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-white/45 sm:block">
            Your fitness, your pace
          </span>
          <Link
            to="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/50 hover:text-white"
          >
            Skip
          </Link>
        </div>
      </header>

      <section
        className="relative mx-auto flex w-full max-w-[1440px] flex-1 items-stretch px-4 pb-5 sm:px-8 lg:px-12"
        aria-live="polite"
      >
        <div className="relative flex min-h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#26282c] shadow-2xl shadow-black/30 sm:min-h-[620px] lg:min-h-[680px]">
          <img
            key={slide.image}
            src={slide.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101114]/85 via-[#171316]/38 to-[#101114]/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
          <div className="relative z-10 flex w-full flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div className="flex items-center justify-between gap-5">
              <p className="text-[10px] font-extrabold tracking-[0.22em] text-lime-200 sm:text-xs">
                {slide.label}
              </p>
              <div
                className="flex gap-2"
                role="progressbar"
                aria-label="Onboarding progress"
                aria-valuemin={1}
                aria-valuemax={onboardingSlides.length}
                aria-valuenow={activeSlide + 1}
              >
                {onboardingSlides.map((item, index) => (
                  <span
                    key={item.label}
                    className={`h-1 rounded-full transition-all ${
                      index === activeSlide ? "w-9 bg-lime-400" : "w-5 bg-white/35"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="max-w-3xl py-10">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.26em] text-white/60 sm:text-xs">
                A stronger routine starts with one step
              </p>
              <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-[96px]">
                {slide.title}
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-6 text-white/75 sm:text-lg sm:leading-7">
                {slide.description}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-5 border-t border-white/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-between gap-3 sm:justify-start">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={activeSlide === 0}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous onboarding card"
                >
                  <IoArrowBackOutline className="text-lg" />
                </button>
                <span className="text-xs font-bold tracking-widest text-white/55 sm:ml-2">
                  0{activeSlide + 1} <span className="mx-1 text-white/30">/</span> 0{onboardingSlides.length}
                </span>
                <Link
                  to="/register"
                  className="ml-auto text-xs font-semibold text-white/65 underline decoration-white/30 underline-offset-4 hover:text-white sm:ml-5"
                >
                  Create account
                </Link>
              </div>

              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-12 items-center justify-center gap-3 bg-lime-400 px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-gray-950 transition hover:bg-lime-300 sm:min-w-48"
              >
                {isLastSlide ? "Continue to login" : "Next"}
                <IoArrowForward className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 py-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>FITTRACK · TRAIN WITH PURPOSE</span>
        <span>Small steps. Stronger you.</span>
      </footer>
    </main>
  );
};

export default Home;
