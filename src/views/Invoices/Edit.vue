<template>
  <div class="p-6 max-w-4xl mx-auto dark:bg-gray-900 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">Modifier la facture</h1>
    <div v-if="loading" class="text-center dark:text-white">Chargement...</div>
    <InvoiceForm v-else :initial-data="invoiceData" :is-edit="true" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInvoiceStore } from "@/stores/invoices";
import InvoiceForm from "@/components/invoices/InvoiceForm.vue";
import axios from "@/plugins/axios";
import type { InvoiceFormData } from "@/types";

const route = useRoute();
const router = useRouter();
const invoiceStore = useInvoiceStore();
const { updateInvoice } = invoiceStore;
console.log("updateInvoice", updateInvoice);
const loading = ref(true);
const invoiceData = ref<any>(null);

onMounted(async () => {
  const id = route.params.id;
  const response = await axios.get(`/api/invoices/${id}`);
  invoiceData.value = response.data;
  loading.value = false;
});

const handleSubmit = async (data: InvoiceFormData) => {
  const id = route.params.id as number;
  await updateInvoice(id, data);
  router.push("/invoices");
};
</script>
