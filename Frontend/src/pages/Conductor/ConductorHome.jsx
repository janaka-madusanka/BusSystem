import { useEffect, useState } from "react";
import { Bus, MapPin, AlertTriangle, Clock } from "lucide-react";

import StatCard from "../Admin/components/StatCard.jsx";
import authService from "../../api/services/auth.service.js";
import delayService from "../../api/services/delay.service.js";
import routeService from "../../api/services/route.service.js";

export default function ConductorHome() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    user: null,
    delays: [],
    route: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    setLoading(true);

    console.log("🚀 Loading dashboard...");

    // 👤 USER
    const userRes = await authService.getMe();
    const user = userRes?.data?.data || userRes?.data;

    console.log("👤 USER:", user);

    // 🚨 DELAYS
    const delayRes = await delayService.getMyDelays();
    const delays = delayRes?.data?.data || delayRes?.data || [];

    console.log("🚨 DELAYS:", delays);

    // 🛣 ROUTE
    let route = null;

    try {
      const routeRes = await routeService.getMyRoute();
      route = routeRes?.data?.data || routeRes?.data;

      console.log("🛣 MY ROUTE:", route);
    } catch (err) {
      console.log("⚠️ No assigned route found");
    }

    setStats({
      user,
      delays,
      route,
    });

  } catch (err) {
    console.error("❌ Dashboard load error:", err);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="text-gray-400">
        Loading conductor dashboard...
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Conductor Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Welcome, {stats.user?.firstName || "Conductor"}
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Email: {stats.user?.email || "N/A"} • Role: {stats.user?.role || "N/A"}
        </p>
      </div>

      {/* STATS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Bus}
          label="Assigned Bus"
          value={stats.user?.assignedBus?.busNumber || "Not Assigned"}
        />

        <StatCard
          icon={MapPin}
          label="Route"
          value={stats.route?.name || "N/A"}
        />

        <StatCard
          icon={Clock}
          label="Total Trips"
          value={stats.user?.tripsToday || 0}
        />

        <StatCard
          icon={AlertTriangle}
          label="Active Delays"
          value={stats.delays.length}
        />
      </div>

      {/* ROUTE DETAILS */}
      {stats.route && (
        <div className="mt-6 p-4 rounded-xl bg-slate-800 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-2">
            Route Details
          </h2>

          <p className="text-gray-300">
            <strong>Route Name:</strong> {stats.route.name}
          </p>

          <p className="text-gray-300">
            <strong>Origin:</strong>{" "}
            {stats.route.origin || stats.route.startPoint}
          </p>

          <p className="text-gray-300">
            <strong>Destination:</strong>{" "}
            {stats.route.destination || stats.route.endPoint}
          </p>

          <p className="text-gray-300">
  <strong>Stops:</strong>{" "}
  {stats.route.stops?.length > 0
    ? stats.route.stops
        .map((stop) => stop.name)
        .join(" → ")
    : "No stops"}
</p>
        </div>
      )}

      {/* DELAYS */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          My Delay Reports
        </h2>

        {stats.delays.length === 0 ? (
          <p className="text-gray-400">No delay reports found.</p>
        ) : (
          <div className="space-y-3">
            {stats.delays.map((delay) => (
              <div
                key={delay._id}
                className="p-4 rounded-xl bg-slate-800 border border-slate-700"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold">
                    {delay.reason || "Delay Report"}
                  </h3>

                  <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300">
                    {delay.isResolved ? "Resolved" : "Active"}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  Created:{" "}
                  {delay.createdAt
                    ? new Date(delay.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}