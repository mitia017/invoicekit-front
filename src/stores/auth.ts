import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "@/plugins/axios";
import { useNotificationStore } from "./notifications";
import type { User } from "@/types/index";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string) {
    try {
      const response = await axios.post("/api/login", { email, password });

      token.value = response.data.token;
      user.value = response.data.user;

      if (token.value) {
        localStorage.setItem("token", token.value);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
      }

      const notificationStore = useNotificationStore();
      notificationStore.success(`Connexion réussie, bienvenue ${response.data.user.name}!`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const notificationStore = useNotificationStore();
      const message = axiosError?.response?.data?.message || "Erreur lors de la connexion";
      notificationStore.handleApiError(axiosError, message);
      return {
        success: false,
        status: axiosError?.response?.status,
        message: message,
      };
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const response = await axios.post("/api/register", { name, email, password });

      token.value = response.data.token;
      user.value = response.data.user;

      if (token.value) {
        localStorage.setItem("token", token.value);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
      }

      const notificationStore = useNotificationStore();
      notificationStore.success("Inscription réussie!");
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const notificationStore = useNotificationStore();
      const message = axiosError?.response?.data?.message || "Erreur lors de l'inscription";
      notificationStore.handleApiError(axiosError, message);
      if (import.meta.env.DEV) console.error(error);
      return false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    const notificationStore = useNotificationStore();
    notificationStore.info("Vous avez été déconnecté avec succès.");
  }

  async function fetchUser() {
    if (token.value) {
      try {
        const response = await axios.get("/api/user");
        user.value = response.data;
      } catch {
        logout();
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  };
});
