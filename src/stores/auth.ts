import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "@/plugins/axios";
import type { User } from "@/types/index";

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
      return true;
    } catch (error) {
      console.error(error);
      return false;
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
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
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
