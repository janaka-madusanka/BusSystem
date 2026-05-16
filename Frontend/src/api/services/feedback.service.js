import api from "../axios.js";

const feedbackService = {
  // Passenger - submit feedback
  submitFeedback: async (data) => {
    const response = await api.post("/feedback", data);
    return response.data;
  },

  // Passenger - get own feedback
  getMyFeedback: async () => {
    const response = await api.get("/feedback/my");
    return response.data;
  },

  // Admin - get all feedback
  getAllFeedback: async () => {
    const response = await api.get("/feedback");
    return response.data;
  },

  // Admin - mark feedback as reviewed
  reviewFeedback: async (id) => {
    const response = await api.put(`/feedback/${id}/review`);
    return response.data;
  },
};

export default feedbackService;