import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { userRegistration } from "../../services/userServices";
import { saveUser } from "../../redux/features/userSlice";
import {
  getConfirmPasswordError,
  getEmailError,
  getPhoneError,
  getRegistrationPasswordError,
} from "../../utils/authValidation";

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });

  const errors = {
    name: formData.name.trim() ? "" : "Name is required.",
    email: getEmailError(formData.email),
    phone: getPhoneError(formData.phone),
    password: getRegistrationPasswordError(formData.password),
    confirmpassword: getConfirmPasswordError(
      formData.password,
      formData.confirmpassword
    ),
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

  const handleSubmit = async(e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmpassword: true,
    });

    if (
      errors.name ||
      errors.email ||
      errors.phone ||
      errors.password ||
      errors.confirmpassword
    ) return;

    try {
      setLoading(true);
      const response= await userRegistration(formData);
      dispatch(saveUser(response.data.user));
      toast.success(response.data.message || "Registration Succesfull")
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
      error.response?.data?.error ||
      "Registration failed"
      )
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f2f6f4] px-4 py-8 text-slate-900 sm:px-6">
      <div className="relative w-full max-w-md [perspective:1200px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-emerald-100/30 bg-emerald-200/20 shadow-2xl"
        />
        <div className="relative rounded-2xl border border-white/70 bg-white/95 p-6 shadow-[0_28px_90px_rgba(0,20,16,0.38)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              FitTrack<span className="text-emerald-700">.</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create your account and start your fitness journey.
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="register-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              required
              aria-invalid={Boolean((touched.name || submitted) && errors.name)}
              aria-describedby="register-name-error"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
            />
            {(touched.name || submitted) && errors.name && (
              <span id="register-name-error" className="mt-1.5 block text-sm text-red-600" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="register-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              maxLength={254}
              required
              aria-invalid={Boolean((touched.email || submitted) && errors.email)}
              aria-describedby="register-email-error"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
            />
            {(touched.email || submitted) && errors.email && (
              <span id="register-email-error" className="mt-1.5 block text-sm text-red-600" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="register-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
              Mobile number
            </label>
            <input
              id="register-phone"
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="tel"
              maxLength={20}
              required
              aria-invalid={Boolean((touched.phone || submitted) && errors.phone)}
              aria-describedby="register-phone-error"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
            />
            {(touched.phone || submitted) && errors.phone && (
              <span id="register-phone-error" className="mt-1.5 block text-sm text-red-600" role="alert">
                {errors.phone}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="register-password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="flex rounded-lg border border-slate-300 bg-white focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                required
                aria-invalid={Boolean((touched.password || submitted) && errors.password)}
                aria-describedby="register-password-error register-password-hint"
                className="min-w-0 flex-1 rounded-lg bg-transparent px-3.5 py-3 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="flex items-center px-3.5 text-emerald-800 hover:text-emerald-950"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <FiEye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {(touched.password || submitted) && errors.password && (
              <span id="register-password-error" className="mt-1.5 block text-sm text-red-600" role="alert">
                {errors.password}
              </span>
            )}
            <span id="register-password-hint" className="mt-1.5 block text-xs leading-5 text-slate-500">
              Use at least 8 characters, including a capital letter, a small letter, a number, and a symbol.
            </span>
          </div>

          <div>
            <label htmlFor="register-confirm-password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <div className="flex rounded-lg border border-slate-300 bg-white focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10">
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmpassword"
                placeholder="Enter your password again"
                value={formData.confirmpassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete="new-password"
                aria-invalid={Boolean((touched.confirmpassword || submitted) && errors.confirmpassword)}
                aria-describedby="register-confirm-password-error"
                className="min-w-0 flex-1 rounded-lg bg-transparent px-3.5 py-3 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                aria-pressed={showConfirmPassword}
                className="flex items-center px-3.5 text-emerald-800 hover:text-emerald-950"
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <FiEye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {(touched.confirmpassword || submitted) && errors.confirmpassword && (
              <span id="register-confirm-password-error" className="mt-1.5 block text-sm text-red-600" role="alert">
                {errors.confirmpassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#064b3c] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#087256] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-emerald-900 underline decoration-emerald-700 underline-offset-2 hover:text-emerald-700"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};