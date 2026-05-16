import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SiteNav from "../components/Navbar";
import SiteFooter from "../components/Footer";

import delayService from "../api/services/delay.service.js";

import { RefreshCw } from "lucide-react";

export default function LiveDelayPage() {
  const [delays, setDelays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDelays = async () => {
    try {
      setLoading(true);

      const response = await delayService.getActiveDelays();

      // backend format: { success, data }
      setDelays(response.data || []);
    } catch (error) {
      console.log("Error loading delays:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelays();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Live
            </p>

            <h1 className="text-3xl font-black text-slate-800">
              Live Delay Status — Kuliyapitiya → Colombo
            </h1>
          </div>

          <button
            onClick={fetchDelays}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-600">
              <tr>
                <th className="px-5 py-3 font-medium">Bus No</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Delay</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    Loading delays...
                  </td>
                </tr>
              ) : delays.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    No active delays 🎉
                  </td>
                </tr>
              ) : (
                delays.map((d) => (
                  <tr
                    key={d._id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {d.bus?.busNumber || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        {d.status || "Delayed"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {d.estimatedDelayMinutes || 0} min
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {d.reason || "Traffic"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {d.notes || "No note available"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/bus/${d.bus?._id}`}
                        className="font-medium text-emerald-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Back */}
        <div className="mt-6">
          <Link
            to="/timetable"
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            ← Back to Timetable
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}