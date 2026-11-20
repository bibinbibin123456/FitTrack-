import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addFoodEntry, deleteFoodEntry, getFoodEntries } from "../../services/userServices";

const emptyForm = { name: "", calories: "", protein: "", carbs: "", fat: "", mealType: "breakfast" };

const FoodTracker = () => {
  const [form, setForm] = useState(emptyForm);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    try {
      const response = await getFoodEntries();
      setEntries(response.data.entries || []);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load food entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    getFoodEntries()
      .then((response) => {
        if (!cancelled) setEntries(response.data.entries || []);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error.response?.data?.error || "Failed to load food entries");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || Number(form.calories) <= 0) {
      toast.error("Enter a food name and calories.");
      return;
    }
    try {
      setSaving(true);
      await addFoodEntry({
        ...form,
        calories: Number(form.calories),
        protein: Number(form.protein || 0),
        carbs: Number(form.carbs || 0),
        fat: Number(form.fat || 0),
      });
      setForm(emptyForm);
      toast.success("Food entry added");
      await fetchEntries();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add food");
    } finally {
      setSaving(false);
    }
  };

  const removeEntry = async (id) => {
    try {
      await deleteFoodEntry(id);
      setEntries((current) => current.filter((entry) => entry._id !== id));
      toast.success("Food entry deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete food");
    }
  };

  const [today] = useState(() => new Date().toDateString());
  const todayEntries = entries.filter((entry) => new Date(entry.date).toDateString() === today);
  const totals = todayEntries.reduce(
    (result, entry) => ({
      calories: result.calories + Number(entry.calories || 0),
      protein: result.protein + Number(entry.protein || 0),
      carbs: result.carbs + Number(entry.carbs || 0),
      fat: result.fat + Number(entry.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-widest text-lime-500">Nutrition console</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Food Tracker</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            ["Calories", `${totals.calories} kcal`, "text-lime-500"],
            ["Protein", `${totals.protein} g`, "text-sky-500"],
            ["Carbs", `${totals.carbs} g`, "text-amber-500"],
            ["Fat", `${totals.fat} g`, "text-rose-500"],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-2xl border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/60">{label}</p>
              <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <form onSubmit={handleSubmit} className="h-fit space-y-4 rounded-3xl border border-base-300 bg-base-100 p-6">
            <h2 className="text-xl font-bold">Add food</h2>
            <input className="input input-bordered w-full" placeholder="Food name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select className="select select-bordered w-full" value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["calories", "Calories"],
                ["protein", "Protein (g)"],
                ["carbs", "Carbs (g)"],
                ["fat", "Fat (g)"],
              ].map(([name, placeholder]) => (
                <input key={name} type="number" min="0" className="input input-bordered w-full" placeholder={placeholder} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
              ))}
            </div>
            <button className="btn w-full border-0 bg-lime-400 text-gray-950" disabled={saving}>{saving ? "Adding..." : "Add Entry"}</button>
          </form>

          <section className="rounded-3xl border border-base-300 bg-base-100 p-6">
            <h2 className="text-xl font-bold">Recent entries</h2>
            {loading ? (
              <p className="py-10 text-center text-base-content/60">Loading...</p>
            ) : entries.length === 0 ? (
              <p className="py-10 text-center text-base-content/60">No food entries yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {entries.map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between rounded-xl bg-base-200 p-4">
                    <div>
                      <p className="font-bold capitalize">{entry.name}</p>
                      <p className="text-sm text-base-content/60">{entry.mealType} · {entry.calories} kcal · {new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <button className="btn btn-ghost btn-sm text-error" onClick={() => removeEntry(entry._id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default FoodTracker;
