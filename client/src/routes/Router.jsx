import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../components/shared/UserLayout";
import { ProtectedAdminRoute, ProtectedRoute } from "./ProtectedRoutes";
import {
  Register,
  Login,
  CreateChallenge,
  Challenges,
  Dashboard,
  Workouts,
  GPSTracker,
  Leaderboard,
  ChallengeProgress,
  Profile,
  FoodTracker,
  AICoach,
  AdminLogin,
  AdminDashboard,
  Home,
  CalorieCalculator,
} from "./LazyPages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>,
  },
  {
    element: <ProtectedRoute><UserLayout /></ProtectedRoute>,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/create-challenge", element: <CreateChallenge /> },
      { path: "/challenges", element: <Challenges /> },
      { path: "/workouts", element: <Workouts /> },
      { path: "/gps-tracker", element: <GPSTracker /> },
      { path: "/food", element: <FoodTracker /> },
      { path: "/ai-coach", element: <AICoach /> },
      { path: "/calorie-calculator", element: <CalorieCalculator /> },
      { path: "/profile", element: <Profile /> },
      { path: "/leaderboard/:id", element: <Leaderboard /> },
      { path: "/challenge-progress/:id", element: <ChallengeProgress /> },
    ],
  },
]);
