<template>
  <div id="app" class="min-h-screen bg-light-bg dark:bg-gray-900">
    <nav
      v-if="authStore.isAuthenticated"
      class="bg-light-surface dark:bg-gray-800 shadow-md sticky top-0 z-10"
    >
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold text-light-primary dark:text-white"
          >InvoiceKit</router-link
        >
        <div class="flex items-center space-x-6">
          <router-link
            to="/invoices"
            class="text-light-secondary dark:text-gray-300 hover:text-light-accent dark:hover:text-blue-400 transition"
            >Factures</router-link
          >
          <router-link
            to="/clients"
            class="text-light-secondary dark:text-gray-300 hover:text-light-accent dark:hover:text-blue-400 transition"
            >Clients</router-link
          >
          <DarkModeToggle />
          <button
            @click="logout"
            class="text-light-danger dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import DarkModeToggle from "@/components/ui/DarkModeToggle.vue";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style>
/* Couleurs light mode personnalisées (doux pour les yeux) */
.light-bg {
  background-color: #e5e7e2;
}
.light-surface {
  background-color: #eee;
}
.light-primary {
  color: #1e293b;
}
.light-secondary {
  color: #475569;
  font-weight: 900;
}
.light-accent {
  color: #3b82f6;
}
.light-danger {
  color: #ef4444;
}
</style>
