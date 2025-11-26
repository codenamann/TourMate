import api from "./apiClient.js";

export const getStates = () => {
  return api.get("/api/states");
};

export const getStateById = (id) => {
  return api.get(`/api/states/${id}`);
};

export const getCitiesByState = (stateId) => {
  return api.get("/api/cities", { params: { stateId } });
};

export const searchCities = (search, limit = 30) => {
  return api.get("/api/cities", { params: { search, limit } });
};

