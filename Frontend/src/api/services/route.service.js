import api from "../axios.js";

const routeService = {
  // Get all routes (public)
  getRoutes: async (params = {}) => {
    const response = await api.get("/routes", {
      params,
    });

    return response.data;
  },

   // Get route for logged-in conductor (BEST)
  getMyRoute: async () => {
    const response = await api.get("/routes/my");
    return response.data;
  },

  // Get single route by ID (public)
  getRouteById: async (id) => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },

  // Create new route (admin only)
  createRoute: async (routeData) => {
    // routeData example:
    // { routeNumber, name, startPoint, endPoint, stops }

    const response = await api.post("/routes", routeData);
    return response.data;
  },

  // Update route (admin only)
  updateRoute: async (id, routeData) => {
    const response = await api.put(`/routes/${id}`, routeData);
    return response.data;
  },

  // Delete route (admin only)
  deleteRoute: async (id) => {
    const response = await api.delete(`/routes/${id}`);
    return response.data;
  },

 
  
};

export default routeService;