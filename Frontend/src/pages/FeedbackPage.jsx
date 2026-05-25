import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

import SiteNav from "../components/Navbar";
import SiteFooter from "../components/Footer";

import feedbackService from "../api/services/feedback.service.js";
import busService from "../api/services/bus.service.js";

function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [buses, setBuses] = useState([]);
  const [busLoading, setBusLoading] = useState(true);

  const [form, setForm] = useState({
  bus: "",
  problemType: "",
  comment: "",
});

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (user?.role === "conductor") {
          const res = await busService.getMyBus();
          setBuses(res.data ? [res.data] : []);

          if (res.data?._id) {
            setForm((prev) => ({ ...prev, bus: res.data._id }));
          }

          return;
        }

        const res = await busService.getAllBuses();
        setBuses(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setBusLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await feedbackService.submitFeedback(form);
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-100">
      <SiteNav />

      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-4 py-12 sm:px-6">
        {submitted ? (
          <div className="w-full rounded-3xl border border-white/30 bg-white/60 p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
              <Check className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-800">
              Feedback Submitted
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Thank you. Your feedback helps improve service quality.
            </p>

            <Link
              to="/home"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-emerald-700"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-3xl border border-white/30 bg-white/60 p-8 shadow-2xl backdrop-blur-xl"
          >
            <h1 className="text-3xl font-bold text-slate-800">
              Feedback / Complaint
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Share your experience with us.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-100/70 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-8 space-y-6">
              <Field label="Select Bus">
                <select
                  name="bus"
                  value={form.bus}
                  onChange={handleChange}
                  className="glass-field"
                  required
                  disabled={busLoading}
                >
                  <option value="">
                    {busLoading ? "Loading buses..." : "-- Select --"}
                  </option>
                  {buses.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.busNumber}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Problem Type">
                <select
                  name="problemType"
                  value={form.problemType}
                  onChange={handleChange}
                  className="glass-field"
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Compliment">Compliment</option>
                </select>
              </Field>

              <Field label="Comment">
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  rows={5}
                  className="glass-field resize-none"
                  placeholder="Tell us what happened..."
                  required
                />
              </Field>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Link
                to="/home"
                className="rounded-xl border border-slate-300 bg-white/40 px-5 py-2.5 text-sm font-medium text-slate-700 backdrop-blur-md transition hover:bg-white/70"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </main>

      <SiteFooter />

      <style>{`
        .glass-field {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(10px);
          border-radius: 14px;
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          color: #1e293b;
          outline: none;
          transition: all 0.25s ease;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.3);
        }

        .glass-field:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
          background: rgba(255,255,255,0.75);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

export default FeedbackPage;
