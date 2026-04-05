<template>
  <div class="p-6 dark:bg-gray-900 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold dark:text-white">Clients</h1>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Nouveau client
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase"
            >
              Nom
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase"
            >
              Téléphone
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id" class="dark:text-white">
            <td class="px-6 py-4">{{ client.name }}</td>
            <td class="px-6 py-4">{{ client.email }}</td>
            <td class="px-6 py-4">{{ client.phone }}</td>
            <td class="px-6 py-4">
              <button @click="editClient(client)" class="text-blue-600 mr-2 dark:text-blue-400">
                Modifier
              </button>
              <button @click="deleteClient(client.id)" class="text-red-600 dark:text-red-400">
                Supprimer
              </button>
            </td>
          </tr>
          <tr v-if="clients.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              Aucun client trouvé
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de création/édition -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4 dark:text-white">
          {{ showEditModal ? "Modifier client" : "Nouveau client" }}
        </h2>
        <div class="space-y-4">
          <input
            v-model="form.name"
            placeholder="Nom"
            class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            v-model="form.email"
            placeholder="Email"
            class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            v-model="form.phone"
            placeholder="Téléphone"
            class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <textarea
            v-model="form.address"
            placeholder="Adresse"
            rows="3"
            class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
          <input
            v-model="form.vat_number"
            placeholder="Numéro TVA"
            class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div class="flex justify-end space-x-2">
            <button
              @click="closeModal"
              class="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white"
            >
              Annuler
            </button>
            <button
              @click="saveClient"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useClients } from "@/composables/useClients";
import type { Client } from "@/types";

const { clients, fetchClients, createClient, updateClient, deleteClient } = useClients();
const showCreateModal = ref(false);
const showEditModal = ref(false);
const form = ref<Partial<Client>>({});
const editingId = ref<number | null>(null);

onMounted(() => {
  fetchClients();
});

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  form.value = {};
  editingId.value = null;
};

const saveClient = async () => {
  if (editingId.value) {
    await updateClient(editingId.value, form.value);
  } else {
    await createClient(form.value);
  }
  closeModal();
  fetchClients();
};

const editClient = (client: Client) => {
  form.value = { ...client };
  editingId.value = client.id;
  showEditModal.value = true;
};
</script>
