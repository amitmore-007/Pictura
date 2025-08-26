import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if we're not already on login/signup pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  verifyToken: () => api.get('/auth/me'),
};

// Folder API
export const folderAPI = {
  create: (folderData) => api.post('/folders', folderData),
  getAll: (parentId = null) => api.get('/folders', { params: { parent: parentId } }),
  getById: (id) => api.get(`/folders/${id}`),
  update: (id, folderData) => api.put(`/folders/${id}`, folderData),
  delete: (id) => api.delete(`/folders/${id}`),
};

// Image API
export const imageAPI = {
  upload: (formData) => api.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (folderId = null) => {
    const params = {};
    if (folderId) {
      params.folderId = folderId;
    }
    return api.get('/images', { params });
  },
  getById: (id) => api.get(`/images/${id}`),
  update: (id, imageData) => api.put(`/images/${id}`, imageData),
  delete: (id) => api.delete(`/images/${id}`),
  search: (query) => api.get('/images/search', { params: { q: query } }),
};

export default api;