import api from "./apiClient.js";

export const getDestinations = (params = {}) => {
  return api.get("/api/destinations", { params });
};

export const getDestinationById = (id) => {
  return api.get(`/api/destinations/${id}`);
};

export const createDestination = (data, files = []) => {
  const formData = new FormData();
  
  // Append files
  files.forEach((file) => {
    formData.append("images", file);
  });
  
  // Append other data
  Object.keys(data).forEach((key) => {
    if (key !== "images") {
      if (key === "coordinates") {
        // Stringify coordinates object for FormData
        formData.append(key, JSON.stringify(data[key]));
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  return api.post("/admin/api/destinations", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const updateDestination = (id, data, files = []) => {
  const formData = new FormData();
  
  // Append files
  files.forEach((file) => {
    formData.append("images", file);
  });
  
  // Append other data
  Object.keys(data).forEach((key) => {
    if (key !== "images") {
      if (key === "coordinates") {
        // Stringify coordinates object for FormData
        formData.append(key, JSON.stringify(data[key]));
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    } else if (Array.isArray(data[key])) {
      // Append existing image URLs
      data[key].forEach((url) => formData.append("images", url));
    }
  });
  
  return api.put(`/admin/api/destinations/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteDestination = (id) => {
  return api.delete(`/admin/api/destinations/${id}`);
};

