import axios from "axios";
import { getAccessToken, setAccessToken } from "./token.service";

// Crear una instancia de axios
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Para enviar cookies httpOnly
});

// Interceptor de request: agregar el accessToken
api.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: manejar 401 y reintentar
api.interceptors.response.use(
  (response) => {
    // Si el servidor devuelve un nuevo access-token en los headers, actualízalo
    const newAccessToken = response.headers["access-token"]?.split(" ")[1];
    if (newAccessToken) setAccessToken(newAccessToken);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no hemos reintentado aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Reintenta la misma request después del refresh automático
        const retryResponse = await api(originalRequest);
        return retryResponse;
      } catch (retryError) {
        // Si falla incluso después del refresh, redirige al login
        if (window.location.pathname !== "/sign")
          window.location.href = "/sign";
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
