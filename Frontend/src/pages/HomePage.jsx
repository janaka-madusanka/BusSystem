import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  AlertTriangle,
} from "lucide-react";

import SiteNav from "../components/Navbar";
import SiteFooter from "../components/Footer";

export default function HomePage() {
  const [type, setType] = useState("All");

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = "/timetable";
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SiteNav />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-28">

            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs">
              <MapPin size={14} /> Kuliyapitiya → Colombo
            </span>

            <h1 className="mt-5 text-4xl font-bold sm:text-6xl">
              Bus Timetable & Delay Tracker
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-white/80">
              Real-time schedules, delay updates, and crowd levels — all in one place.
            </p>

            {/* SEARCH BOX */}
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 grid max-w-3xl gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur sm:grid-cols-[1fr_1fr_auto]"
            >
              {/* Date */}
              <label className="rounded-xl bg-white p-3 text-black">
                <span className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={14} /> Date
                </span>
                <input type="date" className="mt-1 w-full outline-none" />
              </label>

              {/* Time */}
              <label className="rounded-xl bg-white p-3 text-black">
                <span className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} /> Time
                </span>
                <input type="time" className="mt-1 w-full outline-none" />
              </label>

              {/* Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-white hover:opacity-90"
              >
                <Search size={16} /> Search
              </button>

              {/* Bus type */}
              <div className="sm:col-span-3 flex gap-4 text-sm text-white/90">
                {["CTB", "Private", "All"].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={type === t}
                      onChange={() => setType(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </form>
          </div>

          {/* ALERT BAR */}
          <Link to="/live-delay" className="block bg-green-500 text-white">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 text-sm">
              <AlertTriangle size={16} />
              <span>
                Average delay today: <strong>25 minutes</strong> — Tap for live status
              </span>
            </div>
          </Link>
        </section>

        {/* FEATURES */}
        <section className="mx-auto grid max-w-5xl gap-4 px-4 py-16 sm:grid-cols-3">
          {[
            { title: "Live timetable", body: "Up-to-date CTB & Private schedules." },
            { title: "Real-time delays", body: "Accurate ETA updates." },
            { title: "Crowd levels", body: "Find less crowded buses." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border bg-white p-6">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{c.body}</p>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}