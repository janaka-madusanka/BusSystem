import api from "../axios.js";

const delayService = {
  // Public - get active delays
  getActiveDelays: async () => {
    const response = await api.get("/delays");
    return response.data;
  },

  // Admin - get all delays
  getAllDelays: async () => {
    const response = await api.get("/delays/all");
    return response.data;
  },

  // Conductor - report delay
  reportDelay: async (delayData) => {
    // delayData example:
    // { busId, reason, delayMinutes }

    const response = await api.post("/delays", delayData);
    return response.data;
  },

  // Conductor / Admin - resolve delay
  resolveDelay: async (id) => {
    const response = await api.put(`/delays/${id}/resolve`);
    return response.data;
  },
};

export default delayService;