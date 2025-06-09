// API service for communicating with the backend

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      const error = data.message || response.statusText;
      return Promise.reject(error);
    }
    
    return data;
  } else {
    // Handle non-JSON responses
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    
    return response.text();
  }
};

// Get authentication token from local storage
const getToken = () => {
  return localStorage.getItem('token');
};

// API request with authentication
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };
  
  try {
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.error('API request error:', error);
    return Promise.reject(error.message || 'Network error');
  }
};

// Simple API request without authentication
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, 'POST', data),
  put: (endpoint, data) => apiRequest(endpoint, 'PUT', data),
  delete: (endpoint) => apiRequest(endpoint, 'DELETE'),
};

// Authentication API
export const authApi = {
  login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  googleLogin: () => apiRequest('/auth/google/login'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  refreshToken: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return Promise.reject('No refresh token available');
    return apiRequest('/auth/refresh', 'POST', { refresh_token: refreshToken });
  },
};

// Flagged content API
export const flaggedContentApi = {
  getAll: (page = 1, perPage = 10) => 
    apiRequest(`/flagged-content?page=${page}&per_page=${perPage}`),
  
  getById: (id) => 
    apiRequest(`/flagged-content/${id}`),
  
  create: (contentData) => 
    apiRequest('/flagged-content', 'POST', contentData),
  
  update: (id, contentData) => 
    apiRequest(`/flagged-content/${id}`, 'PUT', contentData),
  
  delete: (id) => 
    apiRequest(`/flagged-content/${id}`, 'DELETE'),
  
  flag: (contentId, flagData) => 
    apiRequest(`/flagged-content/${contentId}/flag`, 'POST', flagData),
  
  verify: (contentId, verificationData) => 
    apiRequest(`/flagged-content/${contentId}/verify`, 'POST', verificationData),
};

// Statistics API
export const statisticsApi = {
  getSummary: () => 
    apiRequest('/statistics/summary'),
  
  getHistory: (days = 30) => 
    apiRequest(`/statistics/history?days=${days}`),
};

// User API
export const userApi = {
  getProfile: () => 
    apiRequest('/user/profile'),
  
  updateProfile: (profileData) => 
    apiRequest('/user/profile', 'PUT', profileData),
  
  getSubmissions: (page = 1, perPage = 10) => 
    apiRequest(`/user/submissions?page=${page}&per_page=${perPage}`),
};

// Export all APIs
export default {
  auth: authApi,
  flaggedContent: flaggedContentApi,
  statistics: statisticsApi,
  user: userApi,
};

