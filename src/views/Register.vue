<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center dark:text-white">Inscription</h1>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 mb-2">Nom</label>
          <input
            type="text"
            v-model="name"
            class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
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
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? "Inscription..." : "S'inscrire" }}
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-center text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </p>
      <p class="mt-4 text-center text-sm dark:text-gray-400">
        Déjà un compte ?
        <router-link to="/login" class="text-blue-600 dark:text-blue-400">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const router = useRouter();
const authStore = useAuthStore();

const isFormValid = computed(() => {
  return name.value.trim().length >= 2 && email.value.includes("@") && password.value.length >= 6;
});

const handleRegister = async () => {
  if (!isFormValid.value || loading.value) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    const success = await authStore.register(name.value, email.value, password.value);

    if (success) {
      router.push("/");
    } else {
      errorMessage.value = "Erreur d'inscription";
    }
  } catch (e) {
    errorMessage.value = "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
};
</script>
