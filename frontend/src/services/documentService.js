import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

/**
 * Upload a document
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Upload response
 */
export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("document", file);

  const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
    timeout: 300000, // 5 minutes timeout for processing
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
  const response = await axios.get(`${API_BASE_URL}/documents`, {
    params: { page, limit },
    withCredentials: true,
  });

  return response.data;
};

/**
 * Get document by ID
 * @param {string} id - Document ID
 * @returns {Promise<Object>} - Document details
 */
export const getDocumentById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/documents/${id}`, {
    withCredentials: true,
  });

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
  const response = await axios.get(`${API_BASE_URL}/documents/search`, {
    params: { q: query, page, limit },
    withCredentials: true,
  });

  return response.data;
};

/**
 * Get document history
 * @param {number} limit - Number of items
 * @returns {Promise<Object>} - Document history
 */
export const getDocumentHistory = async (limit = 20) => {
  const response = await axios.get(`${API_BASE_URL}/documents/history`, {
    params: { limit },
    withCredentials: true,
  });

  return response.data;
};

/**
 * Delete document
 * @param {string} id - Document ID
 * @returns {Promise<Object>} - Delete response
 */
export const deleteDocument = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/documents/${id}`, {
    withCredentials: true,
  });

  return response.data;
};
