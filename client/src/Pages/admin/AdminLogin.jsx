import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/userServices";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await adminLogin(form);
      toast.success(response.data.message);
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080d18] px-4 text-white">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-lime-400">FitTrack control</p>
        <h1 className="text-3xl font-black">Admin Login</h1>
        <input type="email" className="input input-bordered w-full bg-[#0b1220]" placeholder="Admin email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" className="input input-bordered w-full bg-[#0b1220]" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn w-full border-0 bg-lime-400 text-gray-950" disabled={loading}>{loading ? "Signing in..." : "Enter Console"}</button>
      </form>
    </div>
  );
};

export default AdminLogin;
