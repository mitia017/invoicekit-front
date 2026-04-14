<template>
  <div class="p-6 max-w-4xl mx-auto dark:bg-gray-900 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">Modifier la facture</h1>

    <div v-if="loading" class="text-center dark:text-white">Chargement...</div>

    <InvoiceForm
      v-else
      :initial-data="invoiceData"
      :is-edit="true"
      :errors="errors"
      :loading="editing"
      @submit="editFacture"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInvoiceStore } from "@/stores/invoices";
import { useNotificationStore } from "@/stores/notifications";
import InvoiceForm from "@/components/invoices/InvoiceForm.vue";
import axios from "@/plugins/axios";
import type { InvoiceFormData, ApiErrorResponse } from "@/types";
import type { AxiosError } from "axios";

const route = useRoute();
const router = useRouter();
const invoiceStore = useInvoiceStore();
const notificationStore = useNotificationStore();

const loading = ref(true);
const editing = ref(false);
const errors = ref<Record<string, string[]>>({});
const invoiceData = ref<Partial<InvoiceFormData> | undefined>();

const loadInvoice = async () => {
  try {
    const id = Number(route.params.id);
    const invoice = await axios.get(`/api/invoices/${id}`);
    invoiceData.value = invoice.data;
  } catch (err) {
    const error = err instanceof axios.AxiosError ? err : new axios.AxiosError("Unknown error");
    notificationStore.handleApiError(
      error as AxiosError<ApiErrorResponse>,
      "Impossible de charger la facture.",
    );
    loading.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(loadInvoice);

const editFacture = async (data: InvoiceFormData) => {
  if (editing.value) return;

  editing.value = true;
  errors.value = {};

  try {
    const id = Number(route.params.id);
    await invoiceStore.updateInvoice(id, data);

    router.push({ name: "invoices.list" });
  } catch (err) {
    const error = err instanceof axios.AxiosError ? err : new axios.AxiosError("Unknown error");
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (error.response?.status === 422) {
      const validationErrors = error.response.data as Record<string, string[] | string> | undefined;
      if (validationErrors && typeof validationErrors === "object") {
        // Convert any error format to our expected format
        const formattedErrors: Record<string, string[]> = {};
        for (const [key, value] of Object.entries(validationErrors)) {
          formattedErrors[key] = Array.isArray(value) ? value : [value];
        }
        errors.value = formattedErrors;
        notificationStore.handleValidationErrors(formattedErrors);
      }
      return;
    }

    notificationStore.handleApiError(axiosError, "Impossible de modifier la facture.");
  } finally {
    editing.value = false;
  }
};
</script>
