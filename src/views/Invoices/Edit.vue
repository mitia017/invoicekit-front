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
import InvoiceForm from "@/components/invoices/InvoiceForm.vue";
import axios from "@/plugins/axios";
import type { InvoiceFormData } from "@/types";
import type { AxiosError } from "axios";

type InvoiceData = InvoiceFormData & { id: number };

const route = useRoute();
const router = useRouter();
const invoiceStore = useInvoiceStore();

const loading = ref(true);
const editing = ref(false);
const errors = ref<Record<string, string[]>>({});
const invoiceData = ref<InvoiceData | null>(null);

const loadInvoice = async () => {
  try {
    const id = Number(route.params.id);
    const invoice = await axios.get(`/api/invoices/${id}`);
    invoiceData.value = invoice.data;
  } catch (err) {
    console.error("Erreur chargement facture", err);
    alert("Impossible de charger la facture.");
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
    const error = err as AxiosError<{ errors?: Record<string, string[]> }>;

    if (error.invoice?.status === 422) {
      errors.value = error.invoice.data?.errors ?? {};
      return;
    }

    console.error("Erreur mise à jour facture", error);
    alert("Impossible de modifier la facture.");
  } finally {
    editing.value = false;
  }
};
</script>
