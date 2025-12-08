import axios from "axios";

// Configure axios instance with credentials
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/users/login") ||
      error.config?.url?.includes("/users/signup") ||
      error.config?.url?.includes("/users/current");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('accessToken');
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Check current authentication status
export const checkAuthStatus = async () => {
  try {
    const response = await api.get("/users/current");
    return response.data.data.user || null;
  } catch (error) {
    return null;
  }
};

// Sign in user
export const signIn = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  const { user, token } = response.data.data;
  
  // Store token in localStorage for cross-domain authentication
  if (token) {
    localStorage.setItem('accessToken', token);
  }
  
  return user;
};

// Sign up new user
export const signUp = async (email, password) => {
  const response = await api.post("/users/signup", { email, password });
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post("/users/forgot-password", { email });
  return response.data.message;
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/users/reset-password", {
    token,
    newPassword,
  });
  return response.data.message;
};

// Verify email
export const verifyEmail = async (token) => {
  const response = await api.get(`/users/verify-email?token=${token}`);
  return response.data.data.user;
};

// Logout user
export const logout = async () => {
  await api.post("/users/logout");
  localStorage.removeItem('accessToken');
};
