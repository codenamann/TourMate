import api from "./apiClient.js";

export const getHiddenGems = () => {
  return api.get("/admin/api/hidden-gems");
};

export const createHiddenGem = (data) => {
  return api.post("/admin/api/hidden-gems", data);
};

export const updateHiddenGem = (id, data) => {
  return api.put(`/admin/api/hidden-gems/${id}`, data);
};

export const deleteHiddenGem = (id) => {
  return api.delete(`/admin/api/hidden-gems/${id}`);
};

export const createMapPin = (data) => {
  return api.post("/admin/api/map/create", data);
};

