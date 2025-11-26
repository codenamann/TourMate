import api from "./apiClient.js";

export const getHiddenGems = () => {
  return api.get("/admin/api/hidden-gems");
};

export const createHiddenGem = (data, files = []) => {
  const formData = new FormData();
  
  // Append files
  files.forEach((file) => {
    formData.append("images", file);
  });
  
  // Append other data
  Object.keys(data).forEach((key) => {
    if (key !== "images") {
      if (key === "coordinates") {
        formData.append(key, JSON.stringify(data[key]));
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  return api.post("/admin/api/hidden-gems", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const updateHiddenGem = (id, data, files = []) => {
  const formData = new FormData();
  
  // Append files
  files.forEach((file) => {
    formData.append("images", file);
  });
  
  // Append other data
  Object.keys(data).forEach((key) => {
    if (key !== "images") {
      if (key === "coordinates") {
        formData.append(key, JSON.stringify(data[key]));
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    } else if (Array.isArray(data[key])) {
      data[key].forEach((url) => formData.append("images", url));
    }
  });
  
  return api.put(`/admin/api/hidden-gems/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteHiddenGem = (id) => {
  return api.delete(`/admin/api/hidden-gems/${id}`);
};

export const createMapPin = (data, files = []) => {
  const formData = new FormData();
  
  // Append files
  files.forEach((file) => {
    formData.append("images", file);
  });
  
  // Append other data
  Object.keys(data).forEach((key) => {
    if (key !== "images") {
      if (key === "coordinates") {
        formData.append(key, JSON.stringify(data[key]));
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  return api.post("/admin/api/map/create", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

