<template>
  <div id="app" class="min-h-screen bg-light-bg dark:bg-gray-900">
    <Toaster />
    <nav
      v-if="authStore.isAuthenticated"
      class="bg-light-surface dark:bg-gray-800 shadow-md sticky top-0 z-50"
    >
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="text-2xl font-bold text-light-primary dark:text-white">
          InvoiceKit
        </router-link>

        <!-- Desktop menu -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link
            to="/invoices"
            class="text-light-secondary dark:text-gray-300 hover:text-light-accent dark:hover:text-blue-400 transition"
          >
            Factures
          </router-link>

          <router-link
            to="/clients"
            class="text-light-secondary dark:text-gray-300 hover:text-light-accent dark:hover:text-blue-400 transition"
          >
            Clients
          </router-link>

          <DarkModeToggle />

          <button
            @click="logout"
            class="text-light-danger dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
          >
            Déconnexion
          </button>
        </div>

        <!-- Hamburger button (mobile) -->
        <button class="md:hidden flex items-center" @click="toggleMenu" aria-label="Menu">
          <X v-if="isOpen" class="w-6 h-6 text-gray-800 dark:text-white" />
          <Menu v-else class="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
      </div>
      <div v-if="isOpen" class="md:hidden px-6 pb-4 space-y-4 bg-light-surface dark:bg-gray-800">
        <router-link
          @click="isOpen = false"
          to="/invoices"
          class="block text-light-secondary dark:text-gray-300"
        >
          Factures
        </router-link>

        <router-link
          @click="isOpen = false"
          to="/clients"
          class="block text-light-secondary dark:text-gray-300"
        >
          Clients
        </router-link>

        <div class="flex items-center justify-between">
          <DarkModeToggle />
        </div>

        <button @click="logout" class="text-left w-full text-light-danger dark:text-red-400">
          Déconnexion
        </button>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { Menu, X } from "lucide-vue-next";
import { ref } from "vue";
import DarkModeToggle from "@/components/ui/DarkModeToggle.vue";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
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
