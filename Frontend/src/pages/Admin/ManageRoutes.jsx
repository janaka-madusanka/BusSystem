import { useEffect, useState } from "react";
import routeService from "../../api/services/route.service.js";

export default function ManageRoutes() {
  const initForm = () => ({
    name: "",
    origin: "",
    destination: "",
    distanceKm: 0,
    avgJourneyMinutes: 0,
    isActive: true,
    stops: [],
  });

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(initForm());

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await routeService.getRoutes();
      const data = res?.routes || res?.data || res || [];
      setRoutes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // ➕ OPEN ADD (FIXED)
  const openAdd = () => {
    setForm(initForm());
    setModal({ type: "add" });
  };

  // ✏️ OPEN EDIT (FIXED)
  const openEdit = (route) => {
    setForm({
      name: route.name || "",
      origin: route.origin || "",
      destination: route.destination || "",
      distanceKm: route.distanceKm || 0,
      avgJourneyMinutes: route.avgJourneyMinutes || 0,
      isActive: route.isActive ?? true,
      stops: route.stops || [],
    });

    setModal({ type: "edit", route });
  };

  const handleSave = async () => {
    try {
      if (modal?.type === "edit") {
        const res = await routeService.updateRoute(
          modal.route._id,
          form
        );

        const updated = res?.data || res;

        setRoutes((prev) =>
          prev.map((r) =>
            r._id === modal.route._id ? updated : r
          )
        );
      } else {
        const res = await routeService.createRoute(form);
        const created = res?.data || res;

        setRoutes((prev) => [created, ...prev]);
      }

      setModal(null);
      setForm(initForm());
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this route?")) return;

    await routeService.deleteRoute(id);
    setRoutes((prev) => prev.filter((r) => r._id !== id));
  };

  const filtered = routes.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.origin?.toLowerCase().includes(search.toLowerCase()) ||
    r.destination?.toLowerCase().includes(search.toLowerCase())
  );

  const addStop = () => {
    setForm((prev) => ({
      ...prev,
      stops: [
        ...prev.stops,
        { name: "", order: prev.stops.length + 1 },
      ],
    }));
  };

  const updateStop = (index, key, value) => {
    const updated = [...form.stops];
    updated[index][key] = value;
    setForm({ ...form, stops: updated });
  };

  const removeStop = (index) => {
    const updated = form.stops.filter((_, i) => i !== index);
    setForm({ ...form, stops: updated });
  };

  return (
    <div className="min-h-screen bg-[#080d16] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Route Management</h1>
          <p className="text-slate-500 text-sm">
            Create, update and manage bus routes
          </p>
        </div>

        {/* FIXED BUTTON */}
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500"
        >
          + Add Route
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search routes..."
        className="mb-4 w-80 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
      />

      {/* TABLE */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1520] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3">Route</th>
              <th className="px-6 py-3">Origin</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Distance</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-slate-500">
                  No routes found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r._id}
                  className="border-t border-white/5"
                >
                  <td className="px-6 py-4 font-medium">
                    {r.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {r.origin}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {r.destination}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {r.distanceKm} km
                  </td>

                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => openEdit(r)}
                      className="text-blue-400"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6">
          <div className="bg-[#0f1520] w-full max-w-2xl p-6 rounded-2xl border border-white/10">

            <h2 className="text-lg font-bold mb-4">
              {modal.type === "edit"
                ? "Edit Route"
                : "Add Route"}
            </h2>

            {/* FORM */}
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Route Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="bg-white/5 p-2 rounded"
              />

              <input
                placeholder="Origin"
                value={form.origin}
                onChange={(e) =>
                  setForm({ ...form, origin: e.target.value })
                }
                className="bg-white/5 p-2 rounded"
              />

              <input
                placeholder="Destination"
                value={form.destination}
                onChange={(e) =>
                  setForm({
                    ...form,
                    destination: e.target.value,
                  })
                }
                className="bg-white/5 p-2 rounded"
              />

              <input
                type="number"
                placeholder="Distance Km"
                value={form.distanceKm}
                onChange={(e) =>
                  setForm({
                    ...form,
                    distanceKm: +e.target.value,
                  })
                }
                className="bg-white/5 p-2 rounded"
              />
            </div>

            {/* STOPS */}
            <div className="mt-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">Stops</h3>
                <button
                  onClick={addStop}
                  className="text-blue-400"
                >
                  + Add Stop
                </button>
              </div>

              {form.stops.map((s, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <input
                    placeholder="Stop name"
                    value={s.name}
                    onChange={(e) =>
                      updateStop(i, "name", e.target.value)
                    }
                    className="bg-white/5 p-2 rounded flex-1"
                  />

                  <input
                    type="number"
                    value={s.order}
                    onChange={(e) =>
                      updateStop(i, "order", +e.target.value)
                    }
                    className="bg-white/5 p-2 rounded w-20"
                  />

                  <button
                    onClick={() => removeStop(i)}
                    className="text-red-400"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)}>
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}