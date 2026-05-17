import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bus,
  Users,
  LayoutDashboard,
  BarChart3,
  Route,
  LogOut,
} from "lucide-react";

const sidebarLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/buses", label: "Manage Buses", icon: Bus },
  { to: "/admin/users", label: "Manage Users", icon: Users },
  { to: "/admin/routes", label: "Manage Routes", icon: Route },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm flex flex-col">

      {/* HEADER */}
      <div className="border-b px-6 py-5">
        <h2 className="text-2xl font-bold text-green-600">BusTrak</h2>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>

      {/* LINKS */}
      <nav className="flex flex-col gap-2 p-4 flex-1">
        {sidebarLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT (BOTTOM FIXED) */}
      <div className="p-4 border-t mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>

    </aside>
  );
}