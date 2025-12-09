import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://docnexus-ai.onrender.com/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 300000, // 5 minutes timeout for processing
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

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 300000, // 5 minutes timeout for processing
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

/**
 * Upload a document
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Upload response
 */
export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("document", file);

  const response = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

/**
 * Get all documents
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} - Documents list
 */
export const getDocuments = async (page = 1, limit = 10) => {
  const response = await api.get("/documents", {
    params: { page, limit },
  });

  return response.data;
};

/**
 * Get document by ID
 * @param {string} id - Document ID
 * @returns {Promise<Object>} - Document details
 */
export const getDocumentById = async (id) => {
  const response = await api.get(`/documents/${id}`);

  return response.data;
};

/**
 * Search documents
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} - Search results
 */
export const searchDocuments = async (query, page = 1, limit = 10) => {
  const response = await api.get("/documents/search", {
    params: { q: query, page, limit },
  });

  return response.data;
};

/**
 * Get document history
 * @param {number} limit - Number of items
 * @returns {Promise<Object>} - Document history
 */
export const getDocumentHistory = async (limit = 20) => {
  const response = await api.get("/documents/history", {
    params: { limit },
  });

  return response.data;
};

/**
 * Delete document
 * @param {string} id - Document ID
 * @returns {Promise<Object>} - Delete response
 */
export const deleteDocument = async (id) => {
  const response = await api.delete(`/documents/${id}`);

  return response.data;
};
