import { lazy } from "react";

const Register = lazy(() =>
  import("../Pages/user/Register").then((module) => ({ default: module.Register }))
);
const Login = lazy(() =>
  import("../Pages/user/Login").then((module) => ({ default: module.Login }))
);
const CreateChallenge = lazy(() => import("../Pages/user/CreateChallenge"));
const Challenges = lazy(() => import("../Pages/user/Challenges"));
const Dashboard = lazy(() => import("../Pages/user/Dashboard"));
const Workouts = lazy(() => import("../Pages/user/Workout"));
const GPSTracker = lazy(() => import("../Pages/user/GPSTracker"));
const Leaderboard = lazy(() => import("../Pages/user/LeaderBoard"));
const ChallengeProgress = lazy(() => import("../Pages/user/ChallengeProgess"));
const Profile = lazy(() => import("../Pages/user/Profile"));
const FoodTracker = lazy(() => import("../Pages/user/FoodTracker"));
const AICoach = lazy(() => import("../Pages/user/AICoach"));
const AdminLogin = lazy(() => import("../Pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../Pages/admin/AdminDashboard"));
const Home = lazy(() => import("../Pages/user/Home"));
const CalorieCalculator = lazy(() => import("../Pages/user/CalorieCalculator"));

export {
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
};
