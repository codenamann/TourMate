import api from "./apiClient.js";

export const getCities = (params = {}) => {
  return api.get("/api/cities", { params });
};

export const getCityById = (id) => {
  return api.get(`/api/cities/${id}`);
};

export const getCitiesByState = (stateId) => {
  return api.get("/api/cities", { params: { stateId } });
};

export const searchCities = (search, limit = 30) => {
  return api.get("/api/cities", { params: { search, limit } });
};

