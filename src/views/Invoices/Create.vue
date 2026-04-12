<template>
  <div class="p-6 max-w-4xl mx-auto dark:bg-gray-900 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">Créer une facture</h1>
    <InvoiceForm @submit="handleSubmit" :errors="errors" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useInvoiceStore } from "@/stores/invoices";
import InvoiceForm from "@/components/invoices/InvoiceForm.vue";
import type { InvoiceFormData } from "@/types";

const router = useRouter();
const { createInvoice } = useInvoiceStore();
const errors = ref<Record<string, string[]>>({});

const handleSubmit = async (data: InvoiceFormData) => {
  try {
    await createInvoice(data);
    router.push("/invoices");
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert("Erreur lors de la création de la facture");
    }
  }
};
</script>
