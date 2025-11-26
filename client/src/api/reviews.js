import api from "./apiClient.js";

export const getReviews = (params = {}) => {
  return api.get("/api/reviews", { params });
};

export const createReview = (data) => {
  return api.post("/api/reviews", data);
};

export const getSafetyReviews = (params = {}) => {
  return api.get("/api/safety-reviews", { params });
};

export const createSafetyReview = (data) => {
  return api.post("/api/safety-reviews", data);
};

export const updateReview = (id, data) => {
  return api.put(`/admin/api/reviews/${id}`, data);
};

export const deleteReview = (id) => {
  return api.delete(`/admin/api/reviews/${id}`);
};

export const getPendingReviews = () => {
  return api.get("/admin/api/reviews");
};

