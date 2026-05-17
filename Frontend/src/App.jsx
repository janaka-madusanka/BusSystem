import { Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TimetablePage from "./pages/TimeTable";
import BusDetailsPage from "./pages/BusDetailsPage";
import CrowdLevelPage from "./pages/CrowdLevelPage";
import LiveDelayPage from "./pages/LiveDelayPage";
import RouteInfoPage from "./pages/RouteInfoPage";
import FeedbackPage from "./pages/FeedbackPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ConductorDashboard from "./pages/Conductor/ConductorDashboard";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/bus/:busId" element={<BusDetailsPage />} />
        <Route path="/bus/:busId/crowd" element={<CrowdLevelPage />} />
        <Route path="/live-delays" element={<LiveDelayPage />} />
        <Route path="/route-info" element={<RouteInfoPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/conductor/*" element={<ConductorDashboard />} />
      </Routes>
    </>
  );
}

export default App;
