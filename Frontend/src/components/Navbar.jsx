import { Link, useLocation } from "react-router-dom";
import { Bus } from "lucide-react";

const links = [
  { to: "/home", label: "Home" },
  { to: "/timetable", label: "Timetable" },
  { to: "/live-delays", label: "Live Delay Status" },
  { to: "/route-info", label: "Route Info" },
  { to: "/feedback", label: "Contact Us" },
];

export default function SiteNav({ minimal = false }) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 text-green-600">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <Bus size={16} />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            BusTrak
          </span>
        </Link>

        {/* Nav Links */}
        {!minimal && (
          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-500">
            {links.map((l) => {
              const isActive = location.pathname === l.to;

              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`transition-colors hover:text-green-700 ${
                    isActive ? "text-green-700 font-medium" : ""
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden sm:inline-flex px-3 py-1.5 text-sm rounded-md hover:bg-green-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition"
          >
            Register
          </Link>

          <span className="ml-2 hidden sm:inline text-xs text-gray-400">
            SI | EN
          </span>
        </div>
      </div>
    </header>
  );
}