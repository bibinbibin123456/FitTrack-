import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearUser, saveUser } from "../redux/features/userSlice";
import { getAdminDashboard, getProfile } from "../services/userServices";
import Loading from "../components/common/Loading";

export const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    let active = true;

    getProfile()
      .then(({ data }) => {
        if (!active) return;
        dispatch(saveUser(data.user));
        setAuthorized(true);
      })
      .catch((error) => {
        if (!active) return;
        localStorage.removeItem("token");
        dispatch(clearUser());
        if (![401, 403].includes(error.response?.status)) {
          toast.error("Unable to verify your sign-in. Please sign in again.");
        }
        setAuthorized(false);
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  if (authorized === null) return <Loading />;
  return authorized ? children : <Navigate to="/login" replace />;
};

export const ProtectedAdminRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    let active = true;

    getAdminDashboard()
      .then(() => {
        if (active) setAuthorized(true);
      })
      .catch((error) => {
        if (!active) return;
        localStorage.removeItem("adminToken");
        if (![401, 403].includes(error.response?.status)) {
          toast.error("Unable to verify your admin sign-in. Please sign in again.");
        }
        setAuthorized(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (authorized === null) return <Loading />;
  return authorized ? children : <Navigate to="/admin/login" replace />;
};
