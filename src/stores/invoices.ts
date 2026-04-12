import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "@/plugins/axios";
import type { Invoice, InvoiceFormData } from "@/types";

export const useInvoiceStore = defineStore("invoices", () => {
  const invoices = ref<Invoice[]>([]);
  const loading = ref(false);
  const pagination = ref(null);

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
    const response = await axios.post("/api/invoices", data);
    invoices.value.unshift(response.data);
    return response.data;
  };
  const updateInvoice = async (id: number, data: Partial<InvoiceFormData>) => {
    const response = await axios.put(`/api/invoices/${id}`, data);
    return response.data;
  };
  const deleteInvoice = async (id: number) => {
    await axios.delete(`/api/invoices/${id}`);
    invoices.value = invoices.value.filter((i) => i.id !== id);
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
    } catch (error) {
      console.error("Erreur téléchargement :", error);
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
