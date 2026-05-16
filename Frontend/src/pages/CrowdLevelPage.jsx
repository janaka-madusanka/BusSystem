import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import { useState } from "react";

import { Check } from "lucide-react";

import SiteNav from "../components/Navbar";
import SiteFooter from "../components/Footer";

import  busService  from "../api/services/bus.service.js";

const options = [
  {
    level: "Low",
    desc: "Seats available",
  },
  {
    level: "Medium",
    desc: "Some seats taken",
  },
  {
    level: "High",
    desc: "Standing passengers",
  },
  {
    level: "Fully Crowded",
    desc: "No space available",
  },
];

export default function CrowdLevelPage() {
  const { busId } = useParams();

  const navigate = useNavigate();

  const [selected, setSelected] =
    useState("Medium");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
  try {
    setLoading(true);

    await busService.updateCrowdLevel(busId, selected);

    alert("Crowd level updated");

    navigate("/timetable"); // ✅ go back to timetable
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Failed to update crowd level");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <SiteNav />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          {/* Header */}
          <h1 className="text-3xl font-black text-slate-800">
            Update Crowd Level
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Bus ID: {busId}
          </p>

          <p className="mt-8 text-sm font-semibold text-slate-700">
            How crowded is the bus right now?
          </p>

          {/* Options */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {options.map((option) => {
              const active =
                selected === option.level;

              return (
                <button
                  key={option.level}
                  type="button"
                  onClick={() =>
                    setSelected(option.level)
                  }
                  className={`group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                    active
                      ? "border-emerald-500 bg-emerald-50 shadow-md"
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  {/* Check Circle */}
                  <span
                    className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                      active
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {active && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </span>

                  {/* Text */}
                  <span>
                    <span className="block text-base font-bold text-slate-800">
                      {option.level}
                    </span>

                    <span className="mt-1 block text-sm text-slate-500">
                      {option.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-end gap-3">
            <Link
              to={`/bus/${busId}`}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </Link>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Updating..."
                : "Submit"}
            </button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}