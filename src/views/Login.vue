<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center dark:text-white">Connexion</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input
            type="email"
            v-model="email"
            class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 dark:text-gray-300 mb-2">Mot de passe</label>
          <input
            type="password"
            v-model="password"
            class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          :disabled="loading || !isValid"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? "Connexion..." : "Se connecter" }}
        </button>
        <p v-if="error" class="mt-4 text-red-600 text-center dark:text-red-400">{{ error }}</p>
      </form>
      <p class="mt-4 text-center text-sm dark:text-gray-400">
        Pas encore de compte ?
        <router-link to="/register" class="text-blue-600 dark:text-blue-400"
          >S'inscrire</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const router = useRouter();
const authStore = useAuthStore();

const isValid = computed(() => {
  return email.value.includes("@") && password.value.length >= 6;
});

const handleLogin = async () => {
  if (loading.value || !isValid.value) return;

  loading.value = true;
  error.value = "";

  try {
    const result = await authStore.login(email.value, password.value);

    if (result.success) {
      router.push("/");
    } else {
      error.value = `Erreur: ${result.message}`;
    }
  } catch (e) {
    error.value = "Erreur serveur";
  } finally {
    loading.value = false;
  }
};
</script>
