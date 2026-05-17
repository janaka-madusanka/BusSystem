import { useEffect, useState } from "react";
import timetableService from "../../api/services/timetable.service.js";
import busService from "../../api/services/bus.service.js";

function ConductorTimetablePage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    bus: "", // backend ID only
    busInfo: null, // UI display only
    date: "",
    trips: [
      {
        tripNumber: 1,
        departureTime: "",
        arrivalTime: "",
        status: "Scheduled",
      },
    ],
  });

  // ✅ Load assigned bus automatically
  useEffect(() => {
    const loadBus = async () => {
      try {
        const res = await busService.getMyBus();

        if (res.success) {
          setForm((prev) => ({
            ...prev,
            bus: res.data._id,
            busInfo: res.data,
          }));
        }
      } catch (err) {
        console.log("Failed to load bus", err);
      }
    };

    loadBus();
  }, []);

  // Load existing timetable (optional)
  useEffect(() => {
    const load = async () => {
      try {
        const data = await timetableService.getMyBusTimetable();

        if (data) {
          setForm((prev) => ({
            ...prev,
            bus: data.bus || prev.bus,
            date: data.date || "",
            trips: data.trips || [],
          }));
        }
      } catch (err) {
        console.log("No existing timetable:", err);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTripChange = (index, field, value) => {
    const updated = [...form.trips];
    updated[index][field] = value;
    setForm({ ...form, trips: updated });
  };

  const addTrip = () => {
    setForm({
      ...form,
      trips: [
        ...form.trips,
        {
          tripNumber: form.trips.length + 1,
          departureTime: "",
          arrivalTime: "",
          status: "Scheduled",
        },
      ],
    });
  };

  const removeTrip = (index) => {
    setForm({
      ...form,
      trips: form.trips.filter((_, i) => i !== index),
    });
  };

  const formatTime = (time24) => {
    if (!time24) return "";

    const [h, m] = time24.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${m} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        bus: form.bus, // ✅ ONLY ID sent to backend
        date: form.date,
        trips: form.trips.map((t) => ({
          ...t,
          departureTime: formatTime(t.departureTime),
          arrivalTime: formatTime(t.arrivalTime),
        })),
      };

      await timetableService.upsertTimetable(payload);

      alert("Timetable saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Conductor Timetable Management
      </h1>

      {/* 🚍 BUS INFO DISPLAY */}
      <div className="p-4 mb-4 border rounded bg-gray-500">
        <p className="font-medium">Assigned Bus</p>

        {form.busInfo ? (
          <div>
            <p className="text-lg font-bold">{form.busInfo.busNumber}</p>
            <p className="text-sm text-gray-600">{form.busInfo.name}</p>
            <p className="text-sm">
              {form.busInfo.origin} → {form.busInfo.destination}
            </p>
          </div>
        ) : (
          <p>Loading bus...</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="font-medium">Date</label>
          <input
            type="text"
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="DD/MM/YYYY"
            className="border p-2 w-full"
            required
          />
        </div>

        {/* Trips */}
        <div>
          <h2 className="font-semibold mt-4">Trips</h2>

          {form.trips.map((trip, index) => (
            <div key={index} className="border p-3 mt-2 space-y-2">
              <input
                type="number"
                value={trip.tripNumber}
                onChange={(e) =>
                  handleTripChange(index, "tripNumber", e.target.value)
                }
                className="border p-2 w-full"
              />

              <input
                type="time"
                value={trip.departureTime}
                onChange={(e) =>
                  handleTripChange(index, "departureTime", e.target.value)
                }
                className="border p-2 w-full"
              />

              <input
                type="time"
                value={trip.arrivalTime}
                onChange={(e) =>
                  handleTripChange(index, "arrivalTime", e.target.value)
                }
                className="border p-2 w-full"
              />

              <select
                value={trip.status}
                onChange={(e) =>
                  handleTripChange(index, "status", e.target.value)
                }
                className="border p-2 w-full"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                type="button"
                onClick={() => removeTrip(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addTrip}
            className="bg-blue-500 text-white px-3 py-1 mt-2"
          >
            + Add Trip
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2"
        >
          {loading ? "Saving..." : "Save Timetable"}
        </button>
      </form>
    </div>
  );
}

export default ConductorTimetablePage;
