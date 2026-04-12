import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "@/plugins/axios";
import type { Client } from "@/types";

export const useClientStore = defineStore("client", () => {
  // --- STATE ---
  const clients = ref<Client[]>([]);
  const loading = ref(false);

  // --- ACTIONS ---
  const fetchClients = async (params = {}) => {
    loading.value = true;
    try {
      const response = await axios.get("/api/clients", { params });
      clients.value = response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    } finally {
      loading.value = false;
    }
  };

  const createClient = async (data: Partial<Client>) => {
    try {
      const response = await axios.post("/api/clients", data);
      clients.value.push(response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur création client:", error);
      throw error;
    }
  };

  const updateClient = async (id: number, data: Partial<Client>) => {
    try {
      const response = await axios.put(`/api/clients/${id}`, data);
      // Optionnel : Mettre à jour le client dans le state local
      const index = clients.value.findIndex((c) => c.id === id);
      if (index !== -1) clients.value[index] = response.data;
      return response.data;
    } catch (error) {
      console.error("Erreur update client:", error);
      throw error;
    }
  };

  const deleteClient = async (id: number) => {
    try {
      await axios.delete(`/api/clients/${id}`);
      // Filtrer le state pour supprimer le client visuellement
      clients.value = clients.value.filter((c) => c.id !== id);
    } catch (error) {
      console.error("Erreur suppression client:", error);
    }
  };

  return {
    clients,
    loading,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
});
