import axios from 'axios';

const apiOrigin = (
  import.meta.env.VITE_API_URL
  || (import.meta.env.DEV
    ? 'http://localhost:8081'
    : 'https://unibus-backend-55sx.onrender.com')
).replace(/\/+$/, '').replace(/\/api$/i, '');

const api = axios.create({
  baseURL: `${apiOrigin}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('unibus-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
