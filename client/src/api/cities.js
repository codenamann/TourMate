import api from "./apiClient.js";

export const getCities = () => {
  return api.get("/api/cities");
};

export const getCityById = (id) => {
  return api.get(`/api/cities/${id}`);
};

