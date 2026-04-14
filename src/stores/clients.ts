import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "@/plugins/axios";
import { useNotificationStore } from "./notifications";
import type { Client, ApiErrorResponse } from "@/types";
import type { AxiosError } from "axios";

export const useClientStore = defineStore("client", () => {
  // --- STATE ---
  const clients = ref<Client[]>([]);
  const loading = ref(false);

  // --- ACTIONS ---
  const fetchClients = async (params: Record<string, unknown> = {}) => {
    loading.value = true;
    try {
      const response = await axios.get("/api/clients", { params });
      clients.value = response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (import.meta.env.DEV)
        console.error("Erreur lors de la récupération des clients:", axiosError);
    } finally {
      loading.value = false;
    }
  };

  const fetchClientById = async (id: number) => {
    try {
      const response = await axios.get(`/api/clients/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (import.meta.env.DEV)
        console.error("Erreur lors de la récupération du client:", axiosError);
      throw axiosError;
    }
  };

  const createClient = async (data: Partial<Client>) => {
    try {
      const response = await axios.post("/api/clients", data);
      clients.value.push(response.data);
      const notificationStore = useNotificationStore();
      notificationStore.success("Client créé avec succès.");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const notificationStore = useNotificationStore();
      if (axiosError?.response?.status === 422) {
        notificationStore.handleValidationErrors(axiosError.response.data?.errors || {});
      } else {
        notificationStore.handleApiError(axiosError, "Erreur lors de la création du client");
      }
      if (import.meta.env.DEV) console.error("Erreur création client:", axiosError);
      throw axiosError;
    }
  };

  const updateClient = async (id: number, data: Partial<Client>) => {
    try {
      const response = await axios.put(`/api/clients/${id}`, data);
      // Optionnel : Mettre à jour le client dans le state local
      const index = clients.value.findIndex((c) => c.id === id);
      if (index !== -1) clients.value[index] = response.data;
      const notificationStore = useNotificationStore();
      notificationStore.success("Client mis à jour avec succès.");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const notificationStore = useNotificationStore();
      if (axiosError?.response?.status === 422) {
        notificationStore.handleValidationErrors(axiosError.response.data?.errors || {});
      } else {
        notificationStore.handleApiError(axiosError, "Erreur lors de la mise à jour du client");
      }
      if (import.meta.env.DEV) console.error("Erreur update client:", axiosError);
      throw axiosError;
    }
  };

  const deleteClient = async (id: number) => {
    try {
      await axios.delete(`/api/clients/${id}`);
      // Filtrer le state pour supprimer le client visuellement
      clients.value = clients.value.filter((c) => c.id !== id);
      const notificationStore = useNotificationStore();
      notificationStore.danger("Client supprimé avec succès.");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const notificationStore = useNotificationStore();
      if (axiosError?.response?.status === 403) {
        notificationStore.error("Vous n'avez pas la permission de supprimer ce client.");
      } else {
        notificationStore.handleApiError(axiosError, "Erreur lors de la suppression du client");
      }
      if (import.meta.env.DEV) console.error("Erreur suppression client:", axiosError);
      throw axiosError;
    }
  };

  return {
    clients,
    loading,
    fetchClients,
    fetchClientById,
    createClient,
    updateClient,
    deleteClient,
  };
});
