/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/core/api/axios.ts
import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  // tenta do zustand; se não tiver, cai no localStorage
  const token = useAuthStore.getState().accessToken || localStorage.getItem('saudemais_token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// (opcional) derruba sessão em 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('saudemais_token');
      // window.location.href = '/login'; // descomente se quiser redirecionar automático
    }
    return Promise.reject(err);
  }
);

export default api;
