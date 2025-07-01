import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/public';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data.user;
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  }
};

export const healthService = {
  async predictSymptoms(symptomsData) {
    const response = await api.post('/predict', symptomsData);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/dashboard-stats');
    return response.data;
  },

  async getHospitals(params) {
    const response = await api.get('/hospitals', { params });
    return response.data;
  },

  async getHealthAlerts(params) {
    const response = await api.get('/health-alerts', { params });
    return response.data;
  },

  async getVlogs(params) {
    const response = await api.get('/vlogs', { params });
    return response.data;
  },

  async createVlog(vlogData) {
    const response = await api.post('/vlogs', vlogData);
    return response.data;
  },

  async getComments(vlogId) {
    const response = await api.get(`/comments/${vlogId}`);
    return response.data;
  },

  async addComment(commentData) {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  async likeVlog(vlogId) {
    const response = await api.post(`/vlogs/${vlogId}/like`);
    return response.data;
  }
};

export default api;