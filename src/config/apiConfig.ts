// apiConfig.ts
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
});

// Interceptor => Thêm token vào request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.url !== "/login" && config.url !== "/models") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor => Xử lý lỗi từ API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Có lỗi xảy ra!";
    return Promise.reject(error);
  }
);

export default api;
