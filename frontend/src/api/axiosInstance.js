import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const auth = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      auth.refreshToken &&
      !originalRequest?.url?.endsWith('/api/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const response = await api.post('/api/auth/refresh', {
          refreshToken: auth.refreshToken,
        });
        const { token, refreshToken } = response.data;
        auth.setAuth(auth.user, token, refreshToken);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch {
        auth.logout();
      }
    }

    if (error.response?.status === 401) auth.logout();
    return Promise.reject(error);
  }
);

export default api;
