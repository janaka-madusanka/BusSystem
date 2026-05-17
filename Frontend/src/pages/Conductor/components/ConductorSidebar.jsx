import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bus,
  Route,
  AlertTriangle,
  LogOut,
} from "lucide-react";

const links = [
  { to: "/conductor", label: "Dashboard", icon: LayoutDashboard },
  { to: "/conductor/timetable", label:"Timetable", icon: Route},
  
  
];

export default function ConductorSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0f1520] border-r border-white/10 flex flex-col">

      {/* HEADER */}
      <div className="p-5 border-b border-white/10">
        <h1 className="text-xl font-bold text-blue-400">
          Conductor Panel
        </h1>
      </div>

      {/* LINKS */}
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {links.map((l) => {
          const Icon = l.icon;
          const active = location.pathname === l.to;

          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                active
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

    </aside>
  );
}