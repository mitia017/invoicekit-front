import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "@/plugins/axios";
import { useNotificationStore } from "./notifications";
import type { Invoice, InvoiceFormData, ApiErrorResponse, Pagination } from "@/types";
import type { AxiosError } from "axios";

export const useInvoiceStore = defineStore("invoices", () => {
  const invoices = ref<Invoice[]>([]);
  const loading = ref(false);
  const pagination = ref<Pagination | null>(null);

  const fetchInvoices = async (params = {}) => {
    loading.value = true;

    try {
      const { data } = await axios.get("/api/invoices", { params });

      invoices.value = data.data;

      pagination.value = {
        current_page: data.current_page,
        last_page: data.last_page,
        prev_page_url: data.prev_page_url,
        next_page_url: data.next_page_url,
      };
    } finally {
      loading.value = false;
    }
  };

  const createInvoice = async (data: InvoiceFormData) => {
    try {
      const response = await axios.post("/api/invoices", data);
      invoices.value.unshift(response.data);
      const notificationStore = useNotificationStore();
      notificationStore.success("Facture créée avec succès.");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const notificationStore = useNotificationStore();
      if (axiosError?.response?.status === 422) {
        notificationStore.handleValidationErrors(axiosError.response.data?.errors || {});
      } else {
        notificationStore.handleApiError(axiosError, "Erreur lors de la création de la facture");
      }
      throw axiosError;
    }
  };
  const updateInvoice = async (id: number, data: Partial<InvoiceFormData>) => {
    try {
      const response = await axios.put(`/api/invoices/${id}`, data);
      const notificationStore = useNotificationStore();
      notificationStore.success("Facture mise à jour avec succès.");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const notificationStore = useNotificationStore();
      if (axiosError?.response?.status === 422) {
        notificationStore.handleValidationErrors(axiosError.response.data?.errors || {});
      } else {
        notificationStore.handleApiError(axiosError, "Erreur lors de la mise à jour de la facture");
      }
      throw axiosError;
    }
  };
  const deleteInvoice = async (id: number) => {
    try {
      await axios.delete(`/api/invoices/${id}`);
      invoices.value = invoices.value.filter((i) => i.id !== id);
      const notificationStore = useNotificationStore();
      notificationStore.danger("Facture supprimée avec succès.");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const notificationStore = useNotificationStore();
      if (axiosError?.response?.status === 403) {
        notificationStore.error("Vous n'avez pas la permission de supprimer cette facture.");
      } else {
        notificationStore.handleApiError(axiosError, "Erreur lors de la suppression de la facture");
      }
      throw axiosError;
    }
  };
  const downloadPDF = async (id: number) => {
    try {
      const response = await axios.get(`/api/invoices/${id}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      const notificationStore = useNotificationStore();
      notificationStore.success("PDF téléchargé avec succès.");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const notificationStore = useNotificationStore();
      notificationStore.handleApiError(axiosError, "Erreur lors du téléchargement du PDF");
      if (import.meta.env.DEV) console.error("Erreur téléchargement :", axiosError);
    }
  };

  return {
    invoices,
    loading,
    pagination,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    downloadPDF,
  };
});
