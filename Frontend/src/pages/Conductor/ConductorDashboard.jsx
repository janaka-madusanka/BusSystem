import { Routes, Route } from "react-router-dom";

import ConductorSidebar from "./components/ConductorSidebar";

import ConductorHome from "./ConductorHome";
import ConductorTimetablePage from "./ConductorTimetablePage";



export default function ConductorDashboard() {
  return (
    <div className="min-h-screen bg-[#080d16] text-white flex">

      {/* Sidebar */}
      <ConductorSidebar />

      {/* Page Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route index element={<ConductorHome />} />
          <Route path="timetable" element={<ConductorTimetablePage />} />
          
        </Routes>
      </main>

    </div>
  );
}