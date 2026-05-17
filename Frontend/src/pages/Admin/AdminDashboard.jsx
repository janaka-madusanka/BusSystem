import { Routes, Route } from "react-router-dom";

import AdminSidebar from "./components/AdminSidebar";

import DashboardHome from "./DashboardHome";
import ManageBuses from "./ManageBuses";
import ManageUsers from "./ManageUsers";
import Analytics from "./Analytics";
import ManageRoutes from "./ManageRoutes";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#080d16] text-white flex">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Page Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="buses" element={<ManageBuses />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="routes" element={<ManageRoutes />} />
          <Route path="analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  );
}