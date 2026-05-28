import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Printer,
  ArrowLeft,
  CalendarDays,
  Clock,
  Search,
  X,
} from "lucide-react";

import SiteNav from "../components/Navbar";
import SiteFooter from "../components/Footer";
import timetableService from "../api/services/timetable.service.js";

export default function TimetablePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [busType, setBusType] = useState("All");

  const toInputDate = (value) => {
    if (!value) return "";

    const [day, month, year] = value.split("/");
    if (!day || !month || !year) return "";

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const toApiDate = (value) => {
    if (!value) return "";

    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchTimetable = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.date) params.date = filters.date;
      if (filters.time) params.time = filters.time;
      if (filters.busType && filters.busType !== "All") {
        params.busType = filters.busType;
      }

      const response = await timetableService.getTimetable(params);

      setTimetables(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Unable to load timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentDate = searchParams.get("date") || "";
    const currentTime = searchParams.get("time") || "";
    const currentBusType = searchParams.get("busType") || "All";

    setDate(currentDate);
    setTime(currentTime);
    setBusType(currentBusType);

    fetchTimetable({
      date: currentDate,
      time: currentTime,
      busType: currentBusType,
    });
  }, [searchParams]);

  const filteredTrips = useMemo(() => {
    return timetables.flatMap((timetable) => {
      const trips = Array.isArray(timetable.trips) ? timetable.trips : [];

      return trips
        .filter((trip) => {
          const matchBusType =
            busType === "All" || timetable.bus?.busType === busType;

          const matchTime =
            !time ||
            trip.departureTime === time ||
            trip.departureTime?.startsWith(time);

          return matchBusType && matchTime;
        })
        .map((trip) => ({
          timetable,
          trip,
        }));
    });
  }, [timetables, busType, time]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (date) params.set("date", date);
    if (time) params.set("time", time);
    if (busType !== "All") params.set("busType", busType);

    setSearchParams(params);
  };

  const handleClear = () => {
    setSearchParams({});
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
              Public Timetable
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-800">
              Kuliyapitiya → Colombo
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Search live bus schedules by date, time, and bus type
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="print:hidden grid w-full gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:max-w-2xl lg:grid-cols-[1fr_1fr_auto_auto]"
          >
            <label className="rounded-xl border border-slate-200 px-3 py-2">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <CalendarDays className="h-4 w-4" />
                Date
              </span>

              <input
                type="date"
                value={toInputDate(date)}
                onChange={(e) => setDate(toApiDate(e.target.value))}
                className="mt-1 w-full bg-transparent text-sm outline-none"
              />
            </label>

            <label className="rounded-xl border border-slate-200 px-3 py-2">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock className="h-4 w-4" />
                Time
              </span>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-4 w-4" />
              Clear
            </button>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-4">
              <span className="text-sm font-semibold text-slate-600">
                Bus Type:
              </span>

              {["All", "CTB", "Private"].map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    name="busType"
                    value={type}
                    checked={busType === type}
                    onChange={(e) => setBusType(e.target.value)}
                    className="accent-emerald-600"
                  />

                  {type}
                </label>
              ))}
            </div>
          </form>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-slate-100 text-left text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Bus No</th>
                  <th className="px-6 py-4 font-semibold">Bus Type</th>
                  <th className="px-6 py-4 font-semibold">Route</th>
                  <th className="px-6 py-4 font-semibold">Trip No</th>
                  <th className="px-6 py-4 font-semibold">Departure</th>
                  <th className="px-6 py-4 font-semibold">Arrival</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Delay</th>
                  <th className="print:hidden px-6 py-4 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Loading timetable...
                    </td>
                  </tr>
                ) : filteredTrips.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No timetables found
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map(({ timetable, trip }) => (
                    <tr
                      key={`${timetable._id}-${trip._id || trip.tripNumber}`}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {timetable.bus?.busNumber || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {timetable.bus?.busType || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {timetable.bus?.route?.origin || "N/A"} →{" "}
                        {timetable.bus?.route?.destination || "N/A"}
                      </td>

                      <td className="px-6 py-4">#{trip.tripNumber}</td>

                      <td className="px-6 py-4">
                        {trip.departureTime || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        {trip.arrivalTime || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            trip.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : trip.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : trip.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {trip.status || "Scheduled"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {timetable.bus?.currentDelay || 0} mins
                      </td>

                      <td className="print:hidden px-6 py-4 text-right">
                        <Link
                          to={`/bus/${timetable.bus?._id}`}
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
        </div>

        <div className="print:hidden mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100"
          >
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