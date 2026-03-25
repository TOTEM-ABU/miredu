import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach token ────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response: normalise errors ───────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || 'Xatolik yuz berdi';

    // Expired / invalid token → force logout
    if (status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(new Error(Array.isArray(message) ? message.join(', ') : message));
  }
);

export default api;
