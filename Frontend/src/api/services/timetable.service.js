import api from "../axios.js";

const timetableService = {
  // Public - get timetable by date / bus type
  getTimetable: async (params = {}) => {
    const response = await api.get("/timetable", {
      params,
    });

    return response.data;
  },

  // Conductor - get own assigned bus timetable
  getMyBusTimetable: async () => {
    const response = await api.get("/timetable/my-bus");

    return response.data;
  },

  // Admin / Conductor - create or update timetable
  upsertTimetable: async (data) => {
    const response = await api.post(
      "/timetable",
      data
    );

    return response.data;
  },

  // Admin / Conductor - update trip status
  updateTripStatus: async (
    timetableId,
    tripNumber,
    status
  ) => {
    const response = await api.put(
      `/timetable/${timetableId}/trip/${tripNumber}`,
      { status }
    );

    return response.data;
  },

  // Admin - get all timetables
  getAllTimetables: async () => {
    const response = await api.get(
      "/timetable/all"
    );

    return response.data;
  },
};

export default timetableService;