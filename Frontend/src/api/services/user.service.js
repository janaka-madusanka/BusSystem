import api from "../axios.js";

const userService = {
  // Get admin stats
  getAdminStats: async () => {
    const response = await api.get(
      "/users/admin/stats"
    );

    return response.data;
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    const response = await api.get(
      "/users",
      {
        params,
      }
    );

    return response.data;
  },

  // Get single user by ID
  getUserById: async (id) => {
    const response = await api.get(
      `/users/${id}`
    );

    return response.data;
  },

  // Create new user (Admin)
  createUser: async (userData) => {
    const response = await api.post(
      "/users",
      userData
    );

    return response.data;
  },

  // Update user (Admin)
  updateUser: async (id, userData) => {
    const response = await api.put(
      `/users/${id}`,
      userData
    );

    return response.data;
  },

  // Delete user (Admin)
  deleteUser: async (id) => {
    const response = await api.delete(
      `/users/${id}`
    );

    return response.data;
  },

  // Get passenger dashboard
  getPassengerDashboard: async () => {
    const response = await api.get(
      "/users/dashboard"
    );

    return response.data;
  },

  // Toggle bus alert
  toggleBusAlert: async (busId) => {
    const response = await api.put(
      `/users/alerts/${busId}`
    );

    return response.data;
  },
};

export default userService;