import SiteNav from "../components/Navbar";
import SiteFooter from "../components/Footer";
import { MapPin } from "lucide-react";

export default function RouteInfoPage() {
  const stops = [
    "Kuliyapitiya",
    "Narammala",
    "Kurunegala",
    "Pannipitiya",
    "Colombo",
  ];

  const faqs = [
    {
      q: "How are delays calculated?",
      a: "Live delays are based on traffic + conductor reports.",
    },
    {
      q: "Can passengers report crowd?",
      a: "Yes, from bus details page.",
    },
    {
      q: "What is CTB?",
      a: "Government bus service in Sri Lanka.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50">
      <SiteNav />

      <main className="flex-1">

        {/* HEADER (GLASS CARD) */}
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-xl p-8">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Route Information
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-800">
              Kuliyapitiya → Colombo
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              ~120 km • 3.5–4.5 hours journey
            </p>
          </div>
        </section>

        {/* MAP + STOPS */}
        <section className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-2">

          {/* MAP CARD */}
          <div className="rounded-3xl overflow-hidden border border-white/30 bg-white/30 backdrop-blur-xl shadow-xl">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=Kuliyapitiya+to+Colombo&output=embed"
              className="h-[420px] w-full"
            />
          </div>

          {/* STOPS CARD */}
          <div className="rounded-3xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-800">
              Major Stops
            </h2>

            <div className="mt-5 space-y-4">
              {stops.map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-4 rounded-2xl bg-white/50 px-4 py-3 shadow-sm border border-white/30"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                    {i + 1}
                  </span>

                  <span className="text-slate-700 font-medium">
                    {s}
                  </span>

                  {i !== stops.length - 1 && (
                    <MapPin className="ml-auto h-4 w-4 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-3xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-xl p-8">
            
            <h2 className="text-2xl font-bold text-slate-800">
              FAQ
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-2xl bg-white/50 border border-white/30 p-5 shadow-sm"
                >
                  <p className="font-semibold text-slate-800">
                    {f.q}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}