import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../../services/userServices";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/features/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    weightKg: "",
    heightCm: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((response) => {
        if (!active) return;
        const user = response.data.user;
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          weightKg: user.weightKg == null ? "" : String(user.weightKg),
          heightCm: user.heightCm == null ? "" : String(user.heightCm),
          gender: user.gender || "",
        });
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Failed to load profile");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await updateProfile({
        name: form.name,
        phone: form.phone,
        weightKg: form.weightKg,
        heightCm: form.heightCm,
        gender: form.gender,
      });
      dispatch(saveUser(response.data.user));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-lime-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-lime-500">Digital identity</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Profile</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="form-control">
              <span className="mb-2 font-semibold">Name</span>
              <input className="input input-bordered w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="form-control">
              <span className="mb-2 font-semibold">Phone</span>
              <input className="input input-bordered w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </label>
            <label className="form-control">
              <span className="mb-2 font-semibold">Weight (kg)</span>
              <input
                className="input input-bordered w-full"
                type="number"
                min="20"
                max="300"
                step="0.1"
                inputMode="decimal"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
              />
            </label>
            <label className="form-control">
              <span className="mb-2 font-semibold">Height (cm)</span>
              <input
                className="input input-bordered w-full"
                type="number"
                min="100"
                max="250"
                step="0.1"
                inputMode="decimal"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
              />
            </label>
          </div>
          <label className="form-control">
            <span className="mb-2 font-semibold">Gender</span>
            <select
              className="select select-bordered w-full"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select an option</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </label>
          <label className="form-control">
            <span className="mb-2 font-semibold">Email</span>
            <input className="input input-bordered w-full" value={form.email} disabled />
          </label>
          <button className="btn border-0 bg-lime-400 text-gray-950 hover:bg-lime-300" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
