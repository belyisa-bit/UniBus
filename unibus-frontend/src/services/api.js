import axios from 'axios';

const api = axios.create({
  // In production the frontend and API can share an origin behind a proxy.
  // Set VITE_API_URL when the API is hosted on a different origin.
  baseURL: `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
