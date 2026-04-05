import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "https://invoicelit-back-main-15mjc4.free.laravel.cloud/";
axios.defaults.withCredentials = true;

// Intercepteur pour ajouter le token d'authentification
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
