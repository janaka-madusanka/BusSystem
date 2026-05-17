import { useEffect, useState } from "react";
import {
  Bus,
  Users,
  Shield,
  User,
  Briefcase,
  Clock,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

import StatCard from "./components/StatCard";

import busService from "../../api/services/bus.service.js";
import delayService from "../../api/services/delay.service.js";
import feedbackService from "../../api/services/feedback.service.js";
import userService from "../../api/services/user.service.js";

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    buses: 0,
    admins: 0,
    passengers: 0,
    conductors: 0,
    delays: 0,
    feedback: 0,
  });

  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        busesRes,
        delaysRes,
        feedbackRes,
        usersRes,
      ] = await Promise.all([
        busService.getAllBuses(),
        delayService.getAllDelays(),
        feedbackService.getAllFeedback(),
        userService.getAllUsers(),
      ]);

      // =========================
      // FIX API STRUCTURE
      // =========================
      const buses = busesRes?.data || [];
      const delays = delaysRes?.data || [];
      const feedbackList = feedbackRes?.data || [];
      const users = usersRes?.data || [];

      // =========================
      // ROLE COUNTS
      // =========================
      const admins = users.filter(u => u.role === "admin").length;
      const passengers = users.filter(u => u.role === "passenger").length;
      const conductors = users.filter(u => u.role === "conductor").length;

      setStats({
        buses: buses.length,
        admins,
        passengers,
        conductors,
        delays: delays.length,
        feedback: feedbackList.length,
      });

      setFeedback(feedbackList);

      console.log("Users:", users);
      console.log("Roles:", { admins, passengers, conductors });

    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div>
        <p className="text-xs uppercase tracking-wider text-white">
          Admin Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white">
          System Overview
        </h1>
      </div>

      {/* STATS CARDS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        <StatCard icon={Bus} label="Total Buses" value={stats.buses} />

        <StatCard icon={Shield} label="Admins" value={stats.admins} />

        <StatCard icon={User} label="Passengers" value={stats.passengers} />

        <StatCard icon={Briefcase} label="Conductors" value={stats.conductors} />

        <StatCard icon={Clock} label="Active Delays" value={stats.delays} />

        <StatCard icon={MessageSquare} label="Feedback" value={stats.feedback} />

      </div>

      {/* ALERT */}
      {stats.delays > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
          <AlertTriangle className="mt-1 h-5 w-5" />
          <div>
            <strong>Warning:</strong> There are currently {stats.delays} active delays.
          </div>
        </div>
      )}

      {/* FEEDBACK TABLE */}
<div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1520] shadow-lg">

  {/* Header */}
  <div className="border-b border-white/10 px-6 py-4">
    <h2 className="text-lg font-semibold text-white">
      Recent Feedback
    </h2>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      
      {/* Table Head */}
      <thead className="bg-white/5 text-left text-slate-400">
        <tr>
          <th className="px-6 py-3 uppercase text-xs tracking-wider">Bus</th>
          <th className="px-6 py-3 uppercase text-xs tracking-wider">Type</th>
          <th className="px-6 py-3 uppercase text-xs tracking-wider">Comment</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        {feedback.length > 0 ? (
          feedback.slice(0, 5).map((item, index) => (
            <tr
              key={index}
              className="border-t border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-white">
                {item.busNumber || "N/A"}
              </td>

              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#4f8ef7]/15 text-[#4f8ef7]">
                  {item.type || item.level || "Feedback"}
                </span>
              </td>

              <td className="px-6 py-4 text-slate-400">
                {item.comment || "No comment"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="px-6 py-10 text-center text-slate-500">
              No feedback available
            </td>
          </tr>
        )}
      </tbody>

    </table>
  </div>

      </div>
    </>
  );
}