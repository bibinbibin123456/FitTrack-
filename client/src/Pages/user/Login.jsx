
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  FiActivity,
  FiArrowUpRight,
  FiEye,
  FiEyeOff,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import { userLogin } from "../../services/userServices";
import { saveUser } from "../../redux/features/userSlice";
import {
  getEmailError,
  getLoginPasswordError,
} from "../../utils/authValidation";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    email: getEmailError(formData.email),
    password: getLoginPasswordError(formData.password),
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (e) => {
    setTouched((current) => ({ ...current, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ email: true, password: true });

    if (errors.email || errors.password) return;

    try {
      setLoading(true);

      const response = await userLogin(formData);
      const data = response.data;

      // Save user details only when the API returns them
      const loggedInUser = data.user;

      if (loggedInUser) {
        dispatch(saveUser(loggedInUser));
      }

      toast.success(data.message || "Login successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f6f4] px-4 py-8 text-slate-950 sm:px-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(13,54,42,0.12)] md:min-h-[560px] md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-[#128767] via-[#087256] to-[#064b3c] p-8 text-white sm:p-10 md:flex lg:p-12">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              FitTrack<span className="text-emerald-200">.</span>
            </h2>
            <p className="mt-1.5 text-[11px] font-semibold tracking-[0.18em] text-emerald-100">
              YOUR FITNESS. YOUR CHALLENGE.
            </p>
          </div>

          <div className="my-8">
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-emerald-100">
              WELCOME BACK
            </p>
            <h1 className="text-3xl font-extrabold leading-tight lg:text-4xl">
              Keep moving
              <br />
              toward your goals.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-emerald-50/85">
              Pick up where you left off and build stronger habits, one day at a time.
            </p>

            <ul className="mt-7 space-y-4">
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-900">
                  <FiActivity className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">Stay on track</span>
                  <span className="mt-0.5 block text-xs leading-5 text-emerald-50/80">
                    Keep your workouts and healthy habits in one place.
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-900">
                  <FiTarget className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">Take on challenges</span>
                  <span className="mt-0.5 block text-xs leading-5 text-emerald-50/80">
                    Find motivation and celebrate your progress.
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-900">
                  <FiTrendingUp className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">Keep growing</span>
                  <span className="mt-0.5 block text-xs leading-5 text-emerald-50/80">
                    See how far you have come and keep reaching higher.
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <p className="text-xs font-medium text-emerald-100">
            Small steps. Stronger you.
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-8 lg:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
              <img
                src="/images/fittrack-navbar.png"
                alt="FitTrack logo"
                className="mx-auto mb-4 h-16 w-16 object-contain"
              />
              <h1 className="text-3xl font-extrabold tracking-tight">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to FitTrack.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-800">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={254}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-invalid={Boolean((touched.email || submitted) && errors.email)}
                  aria-describedby="login-email-error"
                  className="w-full rounded-lg border border-transparent bg-[#f2f4f3] px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
                />
                {(touched.email || submitted) && errors.email && (
                  <p id="login-email-error" className="mt-2 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-800">
                  Password
                </label>
                <div className="flex rounded-lg border border-transparent bg-[#f2f4f3] focus-within:border-emerald-700 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-700/10">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={Boolean((touched.password || submitted) && errors.password)}
                    aria-describedby="login-password-error"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="flex items-center px-4 text-emerald-800 hover:text-emerald-950"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <FiEye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {(touched.password || submitted) && errors.password && (
                  <p id="login-password-error" className="mt-2 text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#064b3c] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#087256] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <FiArrowUpRight className="h-5 w-5" aria-hidden="true" />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600">
              Don&apos;t have a FitTrack account?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-900 underline decoration-emerald-700 underline-offset-2 hover:text-emerald-700"
              >
                Create your account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};