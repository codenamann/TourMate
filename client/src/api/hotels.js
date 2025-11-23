import api from "./apiClient.js";

export const getHotels = (params = {}) => {
  return api.get("/api/hotels", { params });
};

export const getHotelById = (id) => {
  return api.get(`/api/hotels/${id}`);
};

export const createHotel = (data) => {
  return api.post("/admin/api/hotels", data);
};

export const updateHotel = (id, data) => {
  return api.put(`/admin/api/hotels/${id}`, data);
};

export const deleteHotel = (id) => {
  return api.delete(`/admin/api/hotels/${id}`);
};

