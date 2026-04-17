import axios from "axios";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

httpClient.interceptors.request.use((config) => {
  const { isAuthenticated, accessToken } = useAuthStore.getState();
  if (isAuthenticated()) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
