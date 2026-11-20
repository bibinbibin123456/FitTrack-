import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAdminDashboard,
  getAdminUsers,
  getAdminChallenges,
  deleteAdminUser,
  deleteAdminChallenge,
} from "../../services/userServices";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getAdminDashboard(),
      getAdminUsers(),
      getAdminChallenges(),
    ])
      .then(([dashboard, userResponse, challengeResponse]) => {
        if (cancelled) return;
        setStats(dashboard.data.stats);
        setUsers(userResponse.data.users || []);
        setChallenges(challengeResponse.data.challenges || []);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error.response?.data?.error || "Failed to load admin data");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user and their activity data?")) return;
    try {
      await deleteAdminUser(id);
      setUsers((current) => current.filter((user) => user._id !== id));
      toast.success("User deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete user");
    }
  };

  const removeChallenge = async (id) => {
    if (!window.confirm("Delete this challenge?")) return;
    try {
      await deleteAdminChallenge(id);
      setChallenges((current) => current.filter((challenge) => challenge._id !== id));
      toast.success("Challenge deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete challenge");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-lime-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-widest text-lime-500">System control</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Admin Dashboard</h1>
        <div className="mt-8 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 lg:grid-cols-4">
          {stats && Object.entries(stats).map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-base-300 bg-base-100 p-5">
              <p className="text-sm capitalize text-base-content/60">{label}</p>
              <p className="mt-2 text-3xl font-black text-lime-500">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-base-300 bg-base-100 p-6">
            <h2 className="text-xl font-bold">Users</h2>
            <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
              {users.map((user) => (
                <div key={user._id} className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-base-200 p-3">
                  <div className="min-w-0"><p className="break-words font-bold">{user.name}</p><p className="break-all text-sm text-base-content/60">{user.email}</p></div>
                  <button className="btn btn-ghost btn-sm shrink-0 text-error" onClick={() => removeUser(user._id)}>Delete</button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-base-300 bg-base-100 p-6">
            <h2 className="text-xl font-bold">Challenges</h2>
            <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
              {challenges.map((challenge) => (
                <div key={challenge._id} className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-base-200 p-3">
                  <div className="min-w-0"><p className="break-words font-bold">{challenge.title}</p><p className="text-sm capitalize text-base-content/60">{challenge.activityType} · {challenge.participants?.length || 0} participants</p></div>
                  <button className="btn btn-ghost btn-sm shrink-0 text-error" onClick={() => removeChallenge(challenge._id)}>Delete</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
