import api from "./apiClient.js";

export const sendOTP = (email) => {
  return api.post("/api/auth/send-otp", { email });
};

export const verifyOTP = (email, otpCode) => {
  return api.post("/api/auth/verify-otp", { email, otpCode });
};

export const register = (data) => {
  return api.post("/api/auth/register", data);
};

export const login = (data) => {
  return api.post("/api/auth/login", data);
};

export const adminLogin = (data) => {
  return api.post("/api/auth/admin-login", data);
};

export const getMe = () => {
  return api.get("/api/auth/me");
};

