<template>
  <div class="relative">
    <input
      type="text"
      v-model="clientFilterSearch"
      @input="openSearch"
      @focus="openSearch"
      placeholder="Rechercher un clientItem..."
      class="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    />
    <ul
      v-if="showSuggestions && matchedClients.length"
      class="absolute z-10 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow mt-1 max-h-48 overflow-auto"
    >
      <li
        v-for="clientItem in matchedClients"
        :key="clientItem.id"
        @click="selectClient(clientItem)"
        class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-white"
      >
        {{ clientItem.name }} {{ clientItem.email ? `(${clientItem.email})` : "" }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useClientStore } from "@/stores/clients";
import { useNotificationStore } from "@/stores/notifications";
import type { Client, ApiErrorResponse } from "@/types";
import type { AxiosError } from "axios";
import type { Client } from "@/types";
import { storeToRefs } from "pinia";

const props = defineProps<{
  modelValue?: number | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();

const clientStore = useClientStore();
const notificationStore = useNotificationStore();
const { clients } = storeToRefs(clientStore);
const { fetchClients } = clientStore;
const clientFilterSearch = ref("");
const showSuggestions = ref(false);

const matchedClients = computed(() => {
  if (!clientFilterSearch.value) return clients.value;
  const searchQuery = clientFilterSearch.value.trim().toLowerCase();
  return clients.value.filter(
    (clientItem: Client) =>
      clientItem.name.toLowerCase().includes(searchQuery) ||
      (clientItem.email && clientItem.email.toLowerCase().includes(searchQuery)),
  );
});

const openSearch = () => {
  showSuggestions.value = true;
  if (!clients.value.length) {
    fetchClients();
  }
};

const selectClient = (clientItem) => {
  emit("update:modelValue", clientItem.id);
  clientFilterSearch.value = clientItem.name;
  showSuggestions.value = false;
};

watch(
  () => props.modelValue,
  async (selectedClientId) => {
    if (selectedClientId) {
      const clientItem = clients.value.find((clientItem) => clientItem.id === selectedClientId);
      if (clientItem) {
        clientFilterSearch.value = clientItem.name;
      } else {
        try {
          const clientData = await clientStore.fetchClientById(selectedClientId);
          clientFilterSearch.value = clientData.name;
        } catch (e) {
          const axiosError = e as AxiosError<ApiErrorResponse>;
          if (import.meta.env.DEV) console.error(axiosError);
          notificationStore.handleApiError(axiosError, "Impossible de charger le client.");
        }
      }
    }
  },
  { immediate: true },
);
</script>
