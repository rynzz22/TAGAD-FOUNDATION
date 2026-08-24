import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxied by Vite/Express
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tagad_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tagad_token');
      localStorage.removeItem('tagad_user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
