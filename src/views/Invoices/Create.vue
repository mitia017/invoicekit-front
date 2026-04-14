<template>
  <div class="p-6 max-w-4xl mx-auto dark:bg-gray-900 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">Créer une facture</h1>

    <InvoiceForm @submit="createFacture" :errors="errors" :loading="creating" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useInvoiceStore } from "@/stores/invoices";
import { useNotificationStore } from "@/stores/notifications";
import InvoiceForm from "@/components/invoices/InvoiceForm.vue";
import type { InvoiceFormData } from "@/types";
import type { AxiosError } from "axios";

const router = useRouter();
const invoiceStore = useInvoiceStore();
const notificationStore = useNotificationStore();

const errors = ref<Record<string, string[]>>({});
const creating = ref(false);

const createFacture = async (data: InvoiceFormData) => {
  if (creating.value) return;

  errors.value = {};
  creating.value = true;

  try {
    await invoiceStore.createInvoice(data);

    router.push({ name: "invoices.list" });
  } catch (err) {
    const error = err as AxiosError<{ errors?: Record<string, string[]> }>;

    if (error.response?.status === 422) {
      errors.value = error.response.data?.errors ?? {};
      notificationStore.handleValidationErrors(errors.value);
      return;
    }

    notificationStore.handleApiError(error, "Impossible de créer la facture.");
  } finally {
    creating.value = false;
  }
};
</script>
