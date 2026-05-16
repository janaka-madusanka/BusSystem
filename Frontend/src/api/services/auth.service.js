import api from "../axios.js";

const authService = {
  // Register new user
  register: async (userData) => {
    // userData example:
    // { firstName, lastName, email, password }

    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    // credentials example:
    // { email, password }

    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Get logged-in user (requires token in axios interceptor)
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export default authService;