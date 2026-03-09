import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const samplesApi = {
  getAll: () => api.get('/samples'),
  getById: (id) => api.get(`/samples/${id}`),
  create: (data) => api.post('/samples', data),
  update: (id, data) => api.put(`/samples/${id}`, data),
  delete: (id) => api.delete(`/samples/${id}`),
};

export const experimentsApi = {
  getAll: () => api.get('/experiments'),
  getById: (id) => api.get(`/experiments/${id}`),
  create: (data) => api.post('/experiments', data),
  update: (id, data) => api.put(`/experiments/${id}`, data),
  delete: (id) => api.delete(`/experiments/${id}`),
};

export const resultsApi = {
  getByExperiment: (experimentId) => api.get(`/results/experiment/${experimentId}`),
  create: (data) => api.post('/results', data),
  delete: (id) => api.delete(`/results/${id}`),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard'),
};
