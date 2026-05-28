import { useState } from "react";
import SiteNav from "../components/Navbar";
import SiteFooter from "../components/Footer";
import { MapPin, Ruler, Timer, Bus, CircleDot } from "lucide-react";

export default function RouteInfoPage() {
  const routes = [
    {
      id: "negombo",
      label: "Kuliyapitiya → Colombo via Negombo",
      distance: "~95 km",
      duration: "2h 45m",
      start: "Kuliyapitiya, Sri Lanka",
      end: "Colombo Fort, Sri Lanka",
      via: "Negombo, Sri Lanka",
      stops: [
        "Kuliyapitiya",
        "Udubaddawa",
        "Naththandiya",
        "Kirimetiyana",
        "Dankotuwa",
        "Kochchikade",
        "Negombo",
        "Seeduwa",
        "Katunayake",
        "Ja-Ela",
        "Kandana",
        "Wattala",
        "Peliyagoda",
        "Colombo",
      ],
    },
    {
      id: "kurunegala",
      label: "Kuliyapitiya → Colombo via Kurunegala",
      distance: "~120 km",
      duration: "3h 50m",
      start: "Kuliyapitiya, Sri Lanka",
      end: "Colombo Fort, Sri Lanka",
      via: "Kurunegala, Sri Lanka",
      stops: [
        "Kuliyapitiya",
        "Narammala",
        "Kurunegala",
        "Pannipitiya",
        "Colombo",
      ],
    },
    {
      id: "negombo-only",
      label: "Kuliyapitiya → Negombo",
      distance: "~50 km",
      duration: "1h 45m",
      start: "Kuliyapitiya, Sri Lanka",
      end: "Negombo, Sri Lanka",
      via: "Naththandiya, Sri Lanka",
      stops: [
        "Kuliyapitiya",
        "Udubaddawa",
        "Naththandiya",
        "Dankotuwa",
        "Kochchikade",
        "Negombo",
      ],
    },
  ];

  const [selectedRouteId, setSelectedRouteId] = useState(routes[0].id);

  const selectedRoute =
    routes.find((route) => route.id === selectedRouteId) || routes[0];

  const mapUrl = `https://www.google.com/maps?output=embed&saddr=${encodeURIComponent(
    selectedRoute.start
  )}&daddr=${encodeURIComponent(`${selectedRoute.via} to ${selectedRoute.end}`)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50">
      <SiteNav />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-white/30 bg-white/40 p-8 shadow-xl backdrop-blur-xl">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Route Information
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-800">
              {selectedRoute.label}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              {selectedRoute.distance} • {selectedRoute.duration} journey
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Ruler} label="Total Distance" value={selectedRoute.distance} />
            <StatCard icon={Timer} label="Average Journey" value={selectedRoute.duration} />
            <StatCard icon={MapPin} label="Major Stops" value={`${selectedRoute.stops.length} Stops`} />
            <StatCard icon={Bus} label="Bus Services" value="CTB & Private" />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-white/30 bg-white/30 shadow-xl backdrop-blur-xl">
            <div className="border-b border-white/30 bg-white/70 p-4">
              <label className="text-sm font-semibold text-slate-700">
                Select Route
              </label>

              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
              >
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.label}
                  </option>
                ))}
              </select>
            </div>

            <iframe
              key={mapUrl}
              title={selectedRoute.label}
              src={mapUrl}
              className="h-[620px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="rounded-3xl border border-white/30 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
            <h2 className="text-xl font-bold text-slate-800">Major Stops</h2>

            <p className="mt-1 text-sm text-slate-500">
              {selectedRoute.label} route with {selectedRoute.stops.length} stops
            </p>

            <div className="mt-5 max-h-[640px] space-y-3 overflow-y-auto pr-2">
              {selectedRoute.stops.map((stop, index) => {
                const isFirst = index === 0;
                const isLast = index === selectedRoute.stops.length - 1;

                return (
                  <div
                    key={`${stop}-${index}`}
                    className="flex items-center gap-4 rounded-2xl border border-white/30 bg-white/60 px-4 py-3 shadow-sm"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        isFirst
                          ? "bg-emerald-600"
                          : isLast
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </span>

                    <div>
                      <span className="font-semibold text-slate-700">
                        {stop}
                      </span>

                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <CircleDot className="h-3 w-3" />
                        {isFirst
                          ? "Starting Point"
                          : isLast
                          ? "Final Destination"
                          : "Intermediate Stop"}
                      </p>
                    </div>

                    {!isLast && (
                      <MapPin className="ml-auto h-4 w-4 text-slate-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-3xl border border-white/30 bg-white/40 p-8 shadow-xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-slate-800">FAQ</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <FaqCard
                q="How long does the journey take?"
                a={`Usually around ${selectedRoute.duration}, depending on traffic.`}
              />
              <FaqCard
                q="What are the main bus services?"
                a="Both CTB and Private buses operate on this route."
              />
              <FaqCard
                q="Can passengers report crowd?"
                a="Yes, passengers can report crowd levels from the bus details page."
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Icon className="h-7 w-7 text-emerald-600" />
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-lg font-black text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function FaqCard({ q, a }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/50 p-5 shadow-sm">
      <p className="font-semibold text-slate-800">{q}</p>
      <p className="mt-2 text-sm text-slate-600">{a}</p>
    </div>
  );
}