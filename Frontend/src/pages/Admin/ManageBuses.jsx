import { useState, useEffect } from "react";

import busService from "../../api/services/bus.service.js";
import userService from "../../api/services/user.service.js";

// ─── Constants ─────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Running:   "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Delayed:   "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Completed: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  Scheduled: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  Inactive:  "bg-slate-500/20 text-slate-400 border border-slate-500/30",
};

const CROWD_STYLES = {
  Low:           "bg-emerald-900/40 text-emerald-400",
  Medium:        "bg-yellow-900/40 text-yellow-400",
  High:          "bg-orange-900/40 text-orange-400",
  "Fully Crowded": "bg-red-900/40 text-red-400",
};

const CROWD_BAR = {
  Low: { w: "w-1/4", color: "bg-emerald-400" },
  Medium: { w: "w-1/2", color: "bg-yellow-400" },
  High: { w: "w-3/4", color: "bg-orange-400" },
  "Fully Crowded": { w: "w-full", color: "bg-red-400" },
};

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, cls = "w-4 h-4" }) => {
  const icons = {
    bus: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M16 19v2M8 19v2M2 12h20M7 6V4M17 6V4"/></svg>,
    plus: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>,
    edit: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    user: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    route: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M12 19h4.5a3.5 3.5 0 000-7h-8a3.5 3.5 0 010-7H12"/></svg>,
    search: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    x: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>,
    check: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
    clock: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    filter: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/></svg>,
    warn: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    grid: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    list: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    refresh: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  };
  return icons[name] || null;
};

// ─── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
    <div className={`relative bg-[#0f1520] border border-white/10 rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}
      style={{ animation: "modalIn 0.2s cubic-bezier(.34,1.56,.64,1)" }}>
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
        <h2 className="text-white font-semibold text-lg tracking-tight">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
          <Icon name="x" cls="w-5 h-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ─── Field ─────────────────────────────────────────────────────────────────────
const Field = ({ label, children, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#4f8ef7]/60 focus:ring-1 focus:ring-[#4f8ef7]/30 transition-all";
const selectCls = `${inputCls} cursor-pointer`;

// ─── Bus Form ──────────────────────────────────────────────────────────────────
const BusForm = ({ bus, conductors, routes, onSave, onClose }) => {
  const [form, setForm] = useState({
    busNumber: "",
    busType: "CTB",
    route: "",
    conductor: "",
    currentStatus: "Scheduled",
    crowdLevel: "Low",
    isActive: true,
    currentDelay: 0,
  });

  useEffect(() => {
    if (bus) {
      setForm({
        busNumber: bus?.busNumber || "",
        busType: bus?.busType || "CTB",
        route: bus?.route?._id || bus?.route || "",
        conductor: bus?.conductor?._id || bus?.conductor || "",
        currentStatus: bus?.currentStatus || "Scheduled",
        crowdLevel: bus?.crowdLevel || "Low",
        isActive: bus?.isActive !== undefined ? bus.isActive : true,
        currentDelay: bus?.currentDelay || 0,
      });
    }
  }, [bus]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.busNumber.trim()) return setError("Bus number is required.");
    if (!form.route) return setError("Please select a route.");
    setSaving(true); setError("");
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to save bus.");
    } finally { setSaving(false); }
  };

  return (
    <div className="grid grid-cols-2 gap-4">

  <Field label="Bus Number" required>
    <input
      className={inputCls}
      value={form.busNumber}
      onChange={(e) => set("busNumber", e.target.value.toUpperCase())}
      placeholder="e.g. NB-1234"
    />
  </Field>

  <Field label="Bus Type" required>
    <select
      className={selectCls}
      value={form.busType}
      onChange={(e) => set("busType", e.target.value)}
    >
      <option value="CTB" className="bg-slate-900 text-white">CTB</option>
      <option value="Private" className="bg-slate-900 text-white">Private</option>
    </select>
  </Field>

  <Field label="Route" required>
    <select
      className={selectCls}
      value={form.route}
      onChange={(e) => set("route", e.target.value)}
    >
      <option value="" className="bg-slate-900 text-slate-300">
        — Select Route —
      </option>

      {routes.map((r) => (
        <option
          key={r._id}
          value={r._id}
          className="bg-slate-900 text-white"
        >
          {r.routeNumber} · {r.name}
        </option>
      ))}
    </select>
  </Field>

  <Field label="Conductor">
  <select
    className={selectCls}
    value={form.conductor}
    onChange={(e) => set("conductor", e.target.value)}
  >
    <option value="" className="bg-slate-900 text-slate-300">
      — Unassigned —
    </option>

    {conductors.map((c) => (
      <option
        key={c._id}
        value={c._id}
        className="bg-slate-900 text-white"
      >
        {[c.firstName, c.lastName].filter(Boolean).join(" ") || c.email}
      </option>
    ))}
  </select>
</Field>

  <Field label="Status">
    <select
      className={selectCls}
      value={form.currentStatus}
      onChange={(e) => set("currentStatus", e.target.value)}
    >
      {["Running", "Delayed", "Completed", "Scheduled", "Inactive"].map(
        (s) => (
          <option key={s} value={s} className="bg-slate-900 text-white">
            {s}
          </option>
        )
      )}
    </select>
  </Field>

  <Field label="Crowd Level">
    <select
      className={selectCls}
      value={form.crowdLevel}
      onChange={(e) => set("crowdLevel", e.target.value)}
    >
      {["Low", "Medium", "High", "Fully Crowded"].map((s) => (
        <option key={s} value={s} className="bg-slate-900 text-white">
          {s}
        </option>
      ))}
    </select>
  </Field>

  <Field label="Current Delay (min)">
    <input
      type="number"
      min={0}
      className={inputCls}
      value={form.currentDelay}
      onChange={(e) => set("currentDelay", +e.target.value)}
    />
  </Field>

  <Field label="Active Status">
    <button
      type="button"
      onClick={() => set("isActive", !form.isActive)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
        form.isActive
          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
          : "bg-slate-700/40 border-slate-600/40 text-slate-400"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          form.isActive ? "bg-emerald-400" : "bg-slate-500"
        }`}
      />
      {form.isActive ? "Active" : "Inactive"}
    </button>
  </Field>

  {error && (
    <div className="col-span-2 flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
      <Icon name="warn" cls="w-4 h-4 shrink-0" />
      {error}
    </div>
  )}

  <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-white/8">
    <button
      onClick={onClose}
      className="px-5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 text-sm transition-all"
    >
      Cancel
    </button>

    <button
      onClick={handleSubmit}
      disabled={saving}
      className="px-5 py-2 rounded-xl bg-[#4f8ef7] hover:bg-[#3a7aef] text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
    >
      {saving ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Icon name="check" cls="w-4 h-4" />
      )}
      {bus ? "Save Changes" : "Add Bus"}
    </button>
  </div>
</div>
  );
};

// ─── Delete Confirm ────────────────────────────────────────────────────────────
const DeleteModal = ({ bus, onConfirm, onClose }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Modal title="Delete Bus" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="p-2 bg-red-500/20 rounded-lg shrink-0"><Icon name="warn" cls="w-5 h-5 text-red-400" /></div>
          <div>
            <p className="text-white font-medium">Remove <span className="text-red-300">{bus.busNumber}</span>?</p>
            <p className="text-slate-400 text-sm mt-1">This will permanently delete the bus and all associated data. This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 text-sm transition-all">Cancel</button>
          <button onClick={async () => { setLoading(true); await onConfirm(); }} disabled={loading}
            className="px-5 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Icon name="trash" cls="w-4 h-4" />}
            Delete Bus
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Bus Card (Grid View) ──────────────────────────────────────────────────────
const BusCard = ({ bus, onEdit, onDelete }) => {
  const crowd = CROWD_BAR[bus.crowdLevel] || CROWD_BAR.Low;
  return (
    <div className="group bg-[#0f1520] border border-white/8 rounded-2xl p-5 hover:border-[#4f8ef7]/40 transition-all duration-300 flex flex-col gap-4"
      style={{ animation: "fadeUp 0.3s ease both" }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${bus.busType === "CTB" ? "bg-blue-500/15 text-blue-400" : "bg-violet-500/15 text-violet-400"}`}>
            <Icon name="bus" cls="w-5 h-5" />
          </div>
          <div>
            <p className="text-white font-bold text-base tracking-wide font-mono">{bus.busNumber}</p>
            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${bus.busType === "CTB" ? "bg-blue-500/20 text-blue-300" : "bg-violet-500/20 text-violet-300"}`}>
              {bus.busType}
            </span>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[bus.currentStatus]}`}>
          {bus.currentStatus}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Icon name="route" cls="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{bus.route?.routeNumber} · {bus.route?.name}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Icon name="user" cls="w-3.5 h-3.5 shrink-0" />
          <span>{bus.conductor ? (bus.conductor.name || `${bus.conductor.firstName} ${bus.conductor.lastName}`) : <em className="text-slate-600">No conductor assigned</em>}</span>
        </div>
        {bus.currentDelay > 0 && (
          <div className="flex items-center gap-2 text-amber-400">
            <Icon name="clock" cls="w-3.5 h-3.5 shrink-0" />
            <span>{bus.currentDelay} min delay</span>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-500">Crowd Level</span>
          <span className={`text-xs px-2 py-0.5 rounded-md ${CROWD_STYLES[bus.crowdLevel]}`}>{bus.crowdLevel}</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${crowd.w} ${crowd.color}`}/>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/6">
        <div className={`flex items-center gap-1.5 text-xs ${bus.isActive ? "text-emerald-400" : "text-slate-500"}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${bus.isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`}/>
          {bus.isActive ? "Active" : "Inactive"}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(bus)} className="p-1.5 rounded-lg hover:bg-[#4f8ef7]/20 text-slate-400 hover:text-[#4f8ef7] transition-all">
            <Icon name="edit" cls="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(bus)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all">
            <Icon name="trash" cls="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Bus Row (List View) ───────────────────────────────────────────────────────
const BusRow = ({ bus, onEdit, onDelete }) => (
  <tr className="border-b border-white/5 hover:bg-white/3 transition-colors group">
    <td className="px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${bus.busType === "CTB" ? "bg-blue-500/15 text-blue-400" : "bg-violet-500/15 text-violet-400"}`}>
          <Icon name="bus" cls="w-3.5 h-3.5" />
        </div>
        <span className="text-white font-bold font-mono text-sm">{bus.busNumber}</span>
      </div>
    </td>
    <td className="px-4 py-3.5">
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${bus.busType === "CTB" ? "bg-blue-500/20 text-blue-300" : "bg-violet-500/20 text-violet-300"}`}>
        {bus.busType}
      </span>
    </td>
    <td className="px-4 py-3.5 text-slate-400 text-sm">{bus.route?.routeNumber} · {bus.route?.name}</td>
    <td className="px-4 py-3.5 text-sm">
      {bus.conductor
        ? <span className="text-slate-300">{bus.conductor.name || `${bus.conductor.firstName} ${bus.conductor.lastName}`}</span>
        : <span className="text-slate-600 italic">Unassigned</span>}
    </td>
    <td className="px-4 py-3.5">
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[bus.currentStatus]}`}>{bus.currentStatus}</span>
    </td>
    <td className="px-4 py-3.5">
      <span className={`text-xs px-2 py-0.5 rounded-md ${CROWD_STYLES[bus.crowdLevel]}`}>{bus.crowdLevel}</span>
    </td>
    <td className="px-4 py-3.5">
      <div className={`flex items-center gap-1.5 text-xs ${bus.isActive ? "text-emerald-400" : "text-slate-500"}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${bus.isActive ? "bg-emerald-400" : "bg-slate-500"}`}/>
        {bus.isActive ? "Active" : "Inactive"}
      </div>
    </td>
    <td className="px-4 py-3.5">
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(bus)} className="p-1.5 rounded-lg hover:bg-[#4f8ef7]/20 text-slate-400 hover:text-[#4f8ef7] transition-all">
          <Icon name="edit" cls="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(bus)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all">
          <Icon name="trash" cls="w-3.5 h-3.5" />
        </button>
      </div>
    </td>
  </tr>
);

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, accent, sub }) => (
  <div className="bg-[#0f1520] border border-white/8 rounded-xl px-5 py-4 flex flex-col gap-1">
    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    {sub && <p className="text-xs text-slate-600">{sub}</p>}
  </div>
);

// ─── Error Banner ──────────────────────────────────────────────────────────────
const ErrorBanner = ({ message, onRetry }) => (
  <div className="flex items-center justify-between gap-4 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4">
    <div className="flex items-center gap-3 text-red-300 text-sm">
      <Icon name="warn" cls="w-4 h-4 shrink-0" />
      {message}
    </div>
    {onRetry && (
      <button onClick={onRetry} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors shrink-0">
        <Icon name="refresh" cls="w-3.5 h-3.5" /> Retry
      </button>
    )}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [conductors, setConductors] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper: get display name from a user object
  const getUserName = (user) =>
    user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null;

  // Populate buses: replace raw ID strings for conductor/route with their full objects
  const populateBuses = (rawBuses, allUsers) => {
    const userMap = new Map(allUsers.map(u => [u._id, u]));
    return rawBuses.map(bus => ({
      ...bus,
      // If conductor is a plain ID string, look it up; if already an object, keep it
      conductor: typeof bus.conductor === "string"
        ? (userMap.get(bus.conductor) ?? null)
        : bus.conductor,
      // route stays as-is (object or ID); handled separately via extractRoutes
      route: bus.route,
    }));
  };

  // Extract unique route objects from buses (only works when route is already populated as object)
  const extractRoutes = (busesData) => {
    const routeMap = new Map();
    busesData.forEach(bus => {
      if (bus.route && typeof bus.route === "object" && bus.route._id) {
        routeMap.set(bus.route._id, bus.route);
      }
    });
    return Array.from(routeMap.values());
  };

  const fetchData = async () => {
  setLoading(true);
  setError(null);

  try {
    const [busRes, userRes] = await Promise.all([
      busService.getAllBuses(),
      userService.getAllUsers(),
    ]);

    const busData = busRes?.data || busRes?.buses || busRes || [];

    // IMPORTANT: do NOT remap conductor anymore
    setBuses(busData);

    const allUsers =
      userRes?.data?.users ||
      userRes?.users ||
      userRes?.data ||
      [];

    const conductorList = allUsers.filter(
      (user) => user.role === "conductor"
    );

    setConductors(conductorList);

    setRoutes(extractRoutes(busData));

  } catch (err) {
    console.error(err);
    setError("Failed to load data.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchData(); }, []);

  const filtered = buses.filter(b => {
    const conductorName = b.conductor?.name || `${b.conductor?.firstName || ""} ${b.conductor?.lastName || ""}`.trim();
    const matchSearch =
      b.busNumber?.includes(search.toUpperCase()) ||
      b.route?.name?.toLowerCase().includes(search.toLowerCase()) ||
      conductorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
  filterStatus === "All"
    ? true
    : filterStatus === "Inactive"
      ? !b.isActive
      : b.currentStatus === filterStatus;
    const matchType = filterType === "All" || b.busType === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    total: buses.length,
    active: buses.filter(b => b.isActive).length,
    running: buses.filter(b => b.currentStatus === "Running").length,
    delayed: buses.filter(b => b.currentStatus === "Delayed").length,
    unassigned: buses.filter(b => !b.conductor || (typeof b.conductor === "string" && !b.conductor)).length,
  };

  // Resolve a raw ID string → full object, or return as-is if already an object
  const resolveConductor = (val) => {
    if (!val) return null;
    if (typeof val === "object") return val;
    return conductors.find(c => c._id === val) || null;
  };
  const resolveRoute = (val, fallback) => {
    if (!val) return fallback || null;
    if (typeof val === "object") return val;
    return routes.find(r => r._id === val) || fallback || null;
  };

  const handleSave = async (formData) => {
    if (modal?.bus) {
      // Edit existing bus
      const res = await busService.updateBus(modal.bus._id, formData);
      const returned = res.bus || res.data || res;
      setBuses(prev => prev.map(b =>
        b._id === modal.bus._id
          ? {
              ...b,
              ...formData,
              // Always resolve to full objects so the UI can display names
              conductor: resolveConductor(formData.conductor),
              route: resolveRoute(formData.route, b.route),
              // Overlay API-returned fields, but re-resolve IDs if the API echoed raw IDs back
              ...(returned && typeof returned === "object" ? {
                ...returned,
                conductor: resolveConductor(returned.conductor ?? formData.conductor),
                route: resolveRoute(returned.route ?? formData.route, b.route),
              } : {}),
            }
          : b
      ));
      showToast(`${formData.busNumber} updated successfully`);
    } else {
      // Create new bus
      const res = await busService.createBus(formData);
      const newBus = res.bus || res.data || res;
      const displayBus = {
        ...formData,
        ...newBus,
        // Resolve IDs → objects regardless of whether API populated them
        conductor: resolveConductor(newBus.conductor ?? formData.conductor),
        route: resolveRoute(newBus.route ?? formData.route, null),
      };
      setBuses(prev => [displayBus, ...prev]);
      showToast(`${formData.busNumber} added successfully`);
    }
  };

  const handleDelete = async () => {
    await busService.deleteBus(modal.bus._id);
    setBuses(prev => prev.filter(b => b._id !== modal.bus._id));
    showToast(`${modal.bus.busNumber} deleted`, false);
    setModal(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes modalIn { from { opacity:0; transform:scale(.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes toastIn { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        ::-webkit-scrollbar { width:6px; height:6px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:#2a3346; border-radius:9px }
      `}</style>

      <div className="min-h-screen bg-[#080d16] text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-[#4f8ef7]/15 rounded-xl text-[#4f8ef7]">
                  <Icon name="bus" cls="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Bus Management</h1>
              </div>
              <p className="text-slate-500 text-sm ml-1">Manage fleet, assign conductors, and track status</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchData} disabled={loading}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                <Icon name="refresh" cls={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button onClick={() => setModal({ type: "add" })}
                className="flex items-center gap-2 bg-[#4f8ef7] hover:bg-[#3a7aef] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#4f8ef7]/20 active:scale-95">
                <Icon name="plus" cls="w-4 h-4" />
                Add New Bus
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && <ErrorBanner message={error} onRetry={fetchData} />}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label="Total Buses" value={stats.total} accent="text-white" />
            <StatCard label="Active" value={stats.active} accent="text-emerald-400" sub={`${stats.total - stats.active} inactive`} />
            <StatCard label="Running" value={stats.running} accent="text-sky-400" />
            <StatCard label="Delayed" value={stats.delayed} accent="text-amber-400" sub="need attention" />
            <StatCard label="No Conductor" value={stats.unassigned} accent="text-rose-400" sub="unassigned" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <Icon name="search" cls="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#4f8ef7]/60 transition-all"
                placeholder="Search bus, route, conductor…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              {["All","Running","Delayed","Scheduled","Completed","Inactive"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? "bg-[#4f8ef7] text-white" : "text-slate-400 hover:text-white"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              {["All","CTB","Private"].map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === t ? "bg-[#4f8ef7] text-white" : "text-slate-400 hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 ml-auto">
              <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-[#4f8ef7] text-white" : "text-slate-400 hover:text-white"}`}>
                <Icon name="grid" cls="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-[#4f8ef7] text-white" : "text-slate-400 hover:text-white"}`}>
                <Icon name="list" cls="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
              <span className="w-5 h-5 border-2 border-slate-700 border-t-[#4f8ef7] rounded-full animate-spin"/>
              Loading buses…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
              <Icon name="bus" cls="w-10 h-10 opacity-20" />
              <p className="text-sm">{buses.length === 0 ? "No buses found." : "No buses match your filters."}</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((b, i) => (
                <div key={b._id} style={{ animationDelay: `${i * 40}ms` }}>
                  <BusCard
                    bus={b}
                    onEdit={b => setModal({ type: "edit", bus: b })}
                    onDelete={b => setModal({ type: "delete", bus: b })}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#0f1520] border border-white/8 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      {["Bus Number","Type","Route","Conductor","Status","Crowd","Active","Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(b => (
                      <BusRow
                        key={b._id}
                        bus={b}
                        onEdit={b => setModal({ type: "edit", bus: b })}
                        onDelete={b => setModal({ type: "delete", bus: b })}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result count */}
          {!loading && (
            <p className="text-xs text-slate-600 text-center">
              Showing {filtered.length} of {buses.length} buses
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* Modals */}
{modal?.type === "add" && (
  <Modal title="Add New Bus" onClose={() => setModal(null)} wide>
    <BusForm

   
  bus={null}
  conductors={conductors}
  routes={routes}
  onSave={handleSave}
  onClose={() => setModal(null)}
/>
  </Modal>
)}

{modal?.type === "edit" && (
  <Modal
    title={`Edit Bus · ${modal?.bus?.busNumber || ""}`}
    onClose={() => setModal(null)}
    wide
  >
    <BusForm
  bus={modal.bus}
  conductors={conductors}
  routes={routes}
  onSave={handleSave}
  onClose={() => setModal(null)}
/>
  </Modal>
)}

{modal?.type === "delete" && (
  <DeleteModal
    bus={modal.bus}
    onConfirm={() => handleDelete(modal.bus._id)}
    onClose={() => setModal(null)}
  />
)}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl z-[100]
  ${toast.ok
    ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-200"
    : "bg-red-900/90 border-red-500/40 text-red-200"
  }`}
          style={{ animation: "toastIn 0.3s ease" }}>
          <Icon name={toast.ok ? "check" : "warn"} cls="w-4 h-4" />
          {toast.msg}
        </div>
      )}
    </>
  );
}