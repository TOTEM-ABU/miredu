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

// ── Response: silent refresh on 401 ─────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

// Xatoliklarni navbatga qo'shish va bir vaqtning o'zida bir nechta so'rovni qayta ishlash
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Xatolik yuz berdi';

    // Agarda 401 (Unauthorized) bo'lsa va bu retry bo'lmasa
    if (status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refresh_token');

      // Refresh token yo'q bo'lsa, tizimdan chiqaramiz
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new Error("Sessiya muddati tugagan. Qaytadan kiring."));
      }

      // Agarda allaqachon birinchi so'rov refresh qilayotgan bo'lsa
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Yangi access_token olish urinishi
        const { data } = await axios.post('/api/User/refresh-token', { refresh_token: refreshToken });
        const newToken = data.access_token;
        
        if (!newToken) throw new Error("Yangi token olinmadi");

        localStorage.setItem('access_token', newToken);
        
        // Global header'ni yangilash
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Kutayotgan barcha so'rovlarni yangi token bilan yuborish
        processQueue(null, newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh ham muvaffaqiyatsiz bo'lsa - to'liq logout
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xatolikni standard formatda qaytarish
    return Promise.reject(new Error(Array.isArray(message) ? message.join(', ') : message));
  }
);

export default api;
