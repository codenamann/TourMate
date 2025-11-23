import api from "./apiClient.js";

export const getDestinations = (params = {}) => {
  return api.get("/api/destinations", { params });
};

export const getDestinationById = (id) => {
  return api.get(`/api/destinations/${id}`);
};

export const createDestination = (data) => {
  return api.post("/admin/api/destinations", data);
};

export const updateDestination = (id, data) => {
  return api.put(`/admin/api/destinations/${id}`, data);
};

export const deleteDestination = (id) => {
  return api.delete(`/admin/api/destinations/${id}`);
};

