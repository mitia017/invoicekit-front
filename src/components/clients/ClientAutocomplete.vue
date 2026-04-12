<template>
  <div class="relative">
    <input
      type="text"
      v-model="search"
      @input="onSearch"
      @focus="onFocus"
      placeholder="Rechercher un client..."
      class="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    />
    <ul
      v-if="showSuggestions && filteredClients.length"
      class="absolute z-10 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow mt-1 max-h-48 overflow-auto"
    >
      <li
        v-for="client in filteredClients"
        :key="client.id"
        @click="selectClient(client)"
        class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-white"
      >
        {{ client.name }} {{ client.email ? `(${client.email})` : "" }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useClientStore } from "@/stores/clients";
import type { Client } from "@/types";
import { storeToRefs } from "pinia";

const props = defineProps<{
  modelValue?: number | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();

const clientStore = useClientStore();
const { clients } = storeToRefs(clientStore);
const { fetchClients } = clientStore;
const search = ref("");
const showSuggestions = ref(false);

const filteredClients = computed(() => {
  if (!search.value) return clients.value;
  const lowerSearch = search.value.trim().toLowerCase();
  return clients.value.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerSearch) ||
      (c.email && c.email.toLowerCase().includes(lowerSearch)),
  );
});

const onSearch = () => {
  showSuggestions.value = true;
  if (!clients.value.length) {
    fetchClients();
  }
};

const onFocus = () => {
  showSuggestions.value = true;
  if (!clients.value.length) {
    fetchClients();
  }
};

const selectClient = (client: Client) => {
  emit("update:modelValue", client.id);
  search.value = client.name;
  showSuggestions.value = false;
};

watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal) {
      const client = clients.value.find((c) => c.id === newVal);
      if (client) {
        search.value = client.name;
      } else {
        try {
          const response = await fetch(`/api/clients/${newVal}`);
          const data = await response.json();
          search.value = data.name;
        } catch (e) {
          console.error(e);
        }
      }
    }
  },
  { immediate: true },
);
</script>
