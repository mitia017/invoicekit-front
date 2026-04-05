<template>
  <div class="p-6 bg-gray-200 dark:bg-gray-900 min-h-screen">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Factures</h1>
      <p class="text-gray-600 dark:text-gray-400">Gérez vos factures et suivez les paiements.</p>
    </div>

    <!-- Cartes KPI (statuts) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Brouillon -->
      <div class="bg-gray-300 dark:bg-gray-700 p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-800 font-extrabold dark:text-gray-200">Brouillon</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ statsByStatus.draft }}
            </p>
          </div>
          <div class="p-3 bg-gray-500 dark:bg-gray-600 rounded-full">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Envoyée -->
      <div class="bg-blue-200 dark:bg-blue-600 p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-800 font-extrabold dark:text-gray-50">Envoyée</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statsByStatus.sent }}</p>
          </div>
          <div class="p-3 bg-blue-500 dark:bg-blue-900 rounded-full">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Payée -->
      <div class="bg-green-100 dark:bg-green-600 p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-800 font-extrabold dark:text-gray-50">Payée</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statsByStatus.paid }}</p>
          </div>
          <div class="p-3 bg-green-500 dark:bg-green-900 rounded-full">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- En retard -->
      <div class="bg-red-100 dark:bg-red-400 p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-800 font-extrabold dark:text-gray-50">En retard</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ statsByStatus.overdue }}
            </p>
          </div>
          <div class="p-3 bg-red-500 dark:bg-red-900 rounded-full">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des factures -->
    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-slate-300 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase"
              >
                N° Facture
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase"
              >
                Client
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase"
              >
                Date d'émission
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase"
              >
                Montant
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase"
              >
                Statut
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-800 dark:text-gray-300 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="invoice in invoices"
              :key="invoice.id"
              class="hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ invoice.invoice_number }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">
                {{ invoice.client?.name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">
                {{ invoice.issue_date }}
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(invoice.total) }}
              </td>
              <td class="px-6 py-4">
                <span :class="statusBadge(invoice.status)" class="px-2 py-1 text-xs rounded-full">{{
                  statusText(invoice.status)
                }}</span>
              </td>
              <td class="px-6 py-4 text-right text-sm space-x-2">
                <router-link
                  :to="`/invoices/${invoice.id}`"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                  >Voir</router-link
                >
                <router-link
                  v-if="invoice.status === 'draft'"
                  :to="`/invoices/${invoice.id}/edit`"
                  class="text-green-600 dark:text-green-400 hover:underline"
                  >Modifier</router-link
                >
                <button
                  @click="downloadPDF(invoice.id)"
                  class="text-gray-600 dark:text-gray-400 hover:underline"
                >
                  PDF
                </button>
                <button
                  v-if="invoice.status === 'draft'"
                  @click="confirmDelete(invoice.id)"
                  class="text-red-600 dark:text-red-400 hover:underline"
                >
                  Supprimer
                </button>
              </td>
            </tr>
            <tr v-if="invoices.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-800 dark:text-gray-400">
                Aucune facture trouvée. Créez votre première facture !
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.last_page > 1"
        class="px-6 py-4 border-t border-light-border dark:border-gray-700 flex justify-between items-center"
      >
        <button
          @click="loadInvoices({ page: pagination.current_page - 1 })"
          :disabled="!pagination.prev_page_url"
          class="px-3 py-1 rounded border border-light-border dark:border-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-300"
        >
          Précédent
        </button>
        <span class="text-sm text-gray-800 dark:text-gray-400"
          >Page {{ pagination.current_page }} sur {{ pagination.last_page }}</span
        >
        <button
          @click="loadInvoices({ page: pagination.current_page + 1 })"
          :disabled="!pagination.next_page_url"
          class="px-3 py-1 rounded border border-light-border dark:border-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-300"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useInvoices } from "@/composables/useInvoices";
import { useCurrency } from "@/composables/useCurrency";
import axios from "@/plugins/axios";

const { invoices, deleteInvoice, downloadPDF } = useInvoices();
const { formatCurrency } = useCurrency();
const pagination = ref<any>(null);

// Calcul des KPI à partir des factures chargées
const statsByStatus = computed(() => {
  if (!invoices.value.length) {
    return { draft: 0, sent: 0, paid: 0, overdue: 0 };
  }
  return {
    draft: invoices.value.filter((i) => i.status === "draft").length,
    sent: invoices.value.filter((i) => i.status === "sent").length,
    paid: invoices.value.filter((i) => i.status === "paid").length,
    overdue: invoices.value.filter((i) => i.status === "overdue").length,
  };
});

// Badges de statut (couleurs adaptées)
const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    draft: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    sent: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    paid: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300",
    overdue: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return map[status] || map.draft;
};

const statusText = (status: string) => {
  const map: Record<string, string> = {
    draft: "Brouillon",
    sent: "Envoyée",
    paid: "Payée",
    overdue: "En retard",
  };
  return map[status] || status;
};

// Charger les factures (avec pagination)
const loadInvoices = async (params = {}) => {
  try {
    const response = await axios.get("/api/invoices", { params });
    invoices.value = response.data.data;
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      prev_page_url: response.data.prev_page_url,
      next_page_url: response.data.next_page_url,
    };
  } catch (error) {
    console.error("Erreur chargement factures", error);
  }
};

// Suppression avec confirmation
const confirmDelete = async (id: number) => {
  if (confirm("Supprimer définitivement cette facture ?")) {
    await deleteInvoice(id);
    await loadInvoices();
  }
};

onMounted(async () => {
  await loadInvoices();
});
</script>
