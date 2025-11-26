import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor - token is now handled by AuthContext setting default headers
api.interceptors.request.use(
  (config) => {
    // Token is automatically added via api.defaults.headers.common["Authorization"]
    // which is set by AuthContext
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";

    if (error.response?.status === 401) {
      // Clear invalid token
      const token = localStorage.getItem("tm_token");
      if (token) {
        localStorage.removeItem("tm_token");
        delete api.defaults.headers.common["Authorization"];
        // Redirect will be handled by ProtectedRoute components
      }
      console.error("Unauthorized access");
    }

    // Log error for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorMessage
    });

    return Promise.reject(error);
  }
);

export default api;

