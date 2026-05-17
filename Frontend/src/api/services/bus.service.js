import api from "../axios.js";

const busService = {
  // Get all buses
  getAllBuses: async (params = {}) => {
    const response = await api.get("/buses", {
      params,
    });
    return response.data;
  },

  // Get single bus by ID
  getBusById: async (id) => {
    const response = await api.get(`/buses/${id}`);
    return response.data;
  },

  // 🔥 NEW: Get logged-in conductor's assigned bus
  getMyBus: async () => {
    const response = await api.get("/buses/my-bus");
    return response.data;
  },

  // Get live delay status
  getLiveDelayStatus: async () => {
    const response = await api.get("/buses/live-delay");
    return response.data;
  },

  // Update crowd level
  updateCrowdLevel: async (id, level) => {
    const response = await api.put(`/buses/${id}/crowd`, {
      level,
    });
    return response.data;
  },

  // Create new bus (Admin)
  createBus: async (busData) => {
    const response = await api.post("/buses", busData);
    return response.data;
  },

  // Update bus (Admin)
  updateBus: async (id, busData) => {
    const response = await api.put(`/buses/${id}`, busData);
    return response.data;
  },

  // Delete bus (Admin)
  deleteBus: async (id) => {
    const response = await api.delete(`/buses/${id}`);
    return response.data;
  },
};

export default busService;