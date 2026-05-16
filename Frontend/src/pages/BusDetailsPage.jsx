import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Bus,
  Clock3,
  Users,
  MapPin,
} from "lucide-react";

import SiteNav from "../components/Navbar";
import SiteFooter from "../components/Footer";

import timetableService from "../api/services/timetable.service";

export default function BusDetailsPage() {
  const { busId } = useParams();

  const [busData, setBusData] = useState(null);

  useEffect(() => {
    fetchBusDetails();
  }, []);

  const fetchBusDetails = async () => {
    try {
      const response =
        await timetableService.getTimetable();

      const foundBus = response.data.find(
        (item) => item.bus?._id === busId
      );

      setBusData(foundBus);
    } catch (error) {
      console.log(error);
    }
  };

  if (!busData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>

          <p className="mt-4 text-slate-500">
            Loading bus details...
          </p>
        </div>
      </div>
    );
  }

  const currentTrip =
    busData.trips.find(
      (trip) => trip.status === "In Progress"
    ) || busData.trips[0];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <SiteNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          {/* Header */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Bus className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
                    Live Bus Tracking
                  </p>

                  <h1 className="text-4xl font-black text-slate-800">
                    {busData.bus?.busNumber}
                  </h1>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
                  {busData.bus?.busType}
                </span>

                <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {busData.bus?.route?.origin} →{" "}
                  {busData.bus?.route?.destination}
                </span>
              </div>
            </div>

            {/* Delay Status */}
            <div>
              <span
                className={`inline-flex rounded-full px-5 py-2 text-sm font-bold ${
                  busData.bus?.currentDelay > 0
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {busData.bus?.currentDelay > 0
                  ? `Delayed +${busData.bus?.currentDelay} mins`
                  : "On Time"}
              </span>
            </div>
          </div>

          {/* Route Progress */}
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-slate-800">
              Route Progress
            </h2>

            <div className="relative flex items-center justify-between">
              {/* Line */}
              <div className="absolute left-0 right-0 top-3 h-1 rounded-full bg-slate-200" />

              {/* Active Line */}
              <div className="absolute left-0 top-3 h-1 w-1/2 rounded-full bg-emerald-500" />

              {[
                busData.bus?.route?.origin,
                "Kurunegala",
                "Negombo",
                busData.bus?.route?.destination,
              ].map((stop, index) => (
                <div
                  key={index}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className={`h-6 w-6 rounded-full border-4 ${
                      index <= 1
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300 bg-white"
                    }`}
                  />

                  <p
                    className={`mt-3 text-xs font-medium ${
                      index === 1
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }`}
                  >
                    {stop}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-100 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Current Status
              </p>

              <p className="mt-2 text-2xl font-black text-slate-800">
                {busData.bus?.currentStatus}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Departure
              </p>

              <p className="mt-2 text-2xl font-black text-slate-800">
                {currentTrip?.departureTime}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Arrival
              </p>

              <p className="mt-2 text-2xl font-black text-slate-800">
                {currentTrip?.arrivalTime}
              </p>
            </div>
          </div>

          {/* Crowd Level */}
          <div className="mt-10 rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Users className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Crowd Level
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-800">
                    {busData.bus?.crowdLevel ||
                      "Medium"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Based on passenger reports
                  </p>
                </div>
              </div>

             <Link
  to={`/bus/${busId}/crowd`}
  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
>
  Update Crowd Level
</Link>
            </div>
          </div>

          {/* Trips */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-black text-slate-800">
              Trip Schedule
            </h2>

            <div className="space-y-4">
              {busData.trips.map((trip) => (
                <div
                  key={trip.tripNumber}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        Trip #{trip.tripNumber}
                      </h3>

                      <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <Clock3 className="h-4 w-4" />
                          Departure:{" "}
                          {trip.departureTime}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <Clock3 className="h-4 w-4" />
                          Arrival:{" "}
                          {trip.arrivalTime}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <Link
            to="/timetable"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Timetable
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}