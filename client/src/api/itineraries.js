import api from "./apiClient.js";

export const fetchItineraries = () => {
  return api.get("/api/itineraries");
};

export const getItineraryById = (id) => {
  return api.get(`/api/itineraries/${id}`);
};

export const createItinerary = (data) => {
  return api.post("/api/itineraries", data);
};

export const updateItinerary = (id, data) => {
  return api.put(`/api/itineraries/${id}`, data);
};

export const deleteItinerary = (id) => {
  return api.delete(`/api/itineraries/${id}`);
};

export const addItemToItinerary = (itineraryId, itemData) => {
  return api.post(`/api/itineraries/${itineraryId}/items`, itemData);
};

export const updateItineraryItem = (itineraryId, itemId, itemData) => {
  return api.put(`/api/itineraries/${itineraryId}/items/${itemId}`, itemData);
};

export const deleteItineraryItem = (itineraryId, itemId) => {
  return api.delete(`/api/itineraries/${itineraryId}/items/${itemId}`);
};

