import { createContext, useContext, useState, useEffect } from "react";
import { register, login, adminLogin, getMe } from "@/api/auth";
import api from "@/api/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("tm_token");
      if (storedToken) {
        setToken(storedToken);
        // Set default auth header
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        
        // Fetch user data
        try {
          const response = await getMe();
          setUser(response.data);
        } catch (error) {
          // Token invalid, clear it
          console.error("Invalid token:", error);
          localStorage.removeItem("tm_token");
          delete api.defaults.headers.common["Authorization"];
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (token, userData) => {
    // Save token
    localStorage.setItem("tm_token", token);
    setToken(token);
    
    // Set axios default header
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    // Set user
    setUser(userData);
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await register({ name, email, password });
      const { token, user } = response.data;
      handleAuthSuccess(token, user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed"
      };
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await login({ email, password });
      const { token, user } = response.data;
      handleAuthSuccess(token, user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed"
      };
    }
  };

  const handleAdminLogin = async (email, password) => {
    try {
      const response = await adminLogin({ email, password });
      const { token, user } = response.data;
      handleAuthSuccess(token, user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Admin login failed"
      };
    }
  };

  const handleLogout = () => {
    // Clear token
    localStorage.removeItem("tm_token");
    setToken(null);
    
    // Remove axios header
    delete api.defaults.headers.common["Authorization"];
    
    // Clear user
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    register: handleRegister,
    login: handleLogin,
    adminLogin: handleAdminLogin,
    logout: handleLogout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

