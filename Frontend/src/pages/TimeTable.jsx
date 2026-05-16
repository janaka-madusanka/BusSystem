import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Download,
  Printer,
  ArrowLeft,
} from "lucide-react";

import SiteNav from "../components/Navbar";
import SiteFooter from "../components/Footer";


import timetableService from "../api/services/timetable.service.js";

export default function TimetablePage() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busType, setBusType] = useState("All");

  // Today's date in DD/MM/YYYY
  const today = new Date().toLocaleDateString(
    "en-GB"
  );

  useEffect(() => {
    fetchTimetable();
  }, [busType]);

  const fetchTimetable = async () => {
  try {
    setLoading(true);

    const response =
      await timetableService.getTimetable({
        busType,
      });

    console.log(response.data);

    setTimetables(
      Array.isArray(response.data)
        ? response.data
        : []
    );
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
              Public Timetable
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-800">
              Kuliyapitiya → Colombo
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Live bus schedules and delays for today
            </p>
          </div>

          {/* Bus Type Filter */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-sm font-semibold text-slate-600">
              Bus Type:
            </span>

            {["CTB", "Private", "All"].map(
              (type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    name="busType"
                    value={type}
                    checked={busType === type}
                    onChange={(e) =>
                      setBusType(e.target.value)
                    }
                    className="accent-emerald-600"
                  />

                  {type}
                </label>
              )
            )}
          </div>
        </div>

        {/* Timetable Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-slate-100 text-left text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Bus No
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Bus Type
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Route
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Trip No
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Departure
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Arrival
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Delay
                  </th>

                  <th className="px-6 py-4 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Loading timetable...
                    </td>
                  </tr>
                ) : timetables.length === 0 ? (
                  /* Empty */
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No timetables found
                    </td>
                  </tr>
                ) : (
                  /* Data */
                  timetables.map((timetable) =>
                    timetable.trips.map(
                      (trip) => (
                        <tr
                          key={`${timetable._id}-${trip.tripNumber}`}
                          className="border-t border-slate-100 transition hover:bg-slate-50"
                        >
                          {/* Bus Number */}
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {timetable.bus?.busNumber}
                          </td>

                          {/* Bus Type */}
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              {timetable.bus?.busType}
                            </span>
                          </td>

                          {/* Route */}
                          <td className="px-6 py-4 text-slate-600">
                            {timetable.bus?.route?.origin} →{" "}
                            {timetable.bus?.route?.destination}
                          </td>

                          {/* Trip Number */}
                          <td className="px-6 py-4">
                            #{trip.tripNumber}
                          </td>

                          {/* Departure */}
                          <td className="px-6 py-4">
                            {trip.departureTime}
                          </td>

                          {/* Arrival */}
                          <td className="px-6 py-4">
                            {trip.arrivalTime}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                trip.status ===
                                "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : trip.status ===
                                    "In Progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : trip.status ===
                                    "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {trip.status}
                            </span>
                          </td>

                          {/* Delay */}
                          <td className="px-6 py-4">
                            <span className="text-slate-600">
                              {timetable.bus?.currentDelay || 0} mins
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/bus/${timetable.bus?._id}`}
                              className="font-medium text-emerald-600 hover:underline"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      )
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100">
            <Download className="h-4 w-4" />
            Export PDF
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100">
            <Printer className="h-4 w-4" />
            Printable View
          </button>

          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}