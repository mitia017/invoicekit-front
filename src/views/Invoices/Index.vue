<template>
  <div class="p-6 bg-gray-200 dark:bg-gray-900 min-h-screen">
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Factures</h1>
        <p class="text-gray-600 dark:text-gray-400">Gérez vos factures et suivez les paiements.</p>
      </div>

      <router-link
        :to="{ name: 'invoices.create' }"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Nouvelle facture
      </router-link>
    </div>

    <!-- KPI -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="kpi in kpis" :key="kpi.label" :class="`${kpi.bg} p-6 rounded-xl shadow-sm`">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-extrabold text-gray-800 dark:text-gray-200">
              {{ kpi.label }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ kpi.value }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-slate-300 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-800 dark:text-gray-300"
              >
                N° Facture
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-800 dark:text-gray-300"
              >
                Client
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-800 dark:text-gray-300"
              >
                Date d'émission
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-800 dark:text-gray-300"
              >
                Montant
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-800 dark:text-gray-300"
              >
                Statut
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium uppercase text-gray-800 dark:text-gray-300"
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
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {{ invoice.invoice_number }}
              </td>

              <td class="px-6 py-4 text-gray-800 dark:text-gray-300">
                {{ invoice.client?.name }}
              </td>

              <td class="px-6 py-4 text-gray-800 dark:text-gray-300">
                {{ invoice.issue_date }}
              </td>

              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(invoice.total) }}
              </td>

              <td class="px-6 py-4">
                <span :class="statusBadge(invoice.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ statusText(invoice.status) }}
                </span>
              </td>

              <td class="px-6 py-4 text-right space-x-2">
                <router-link
                  :to="`/invoices/${invoice.id}`"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Voir
                </router-link>

                <router-link
                  v-if="invoice.status === 'draft'"
                  :to="`/invoices/${invoice.id}/edit`"
                  class="text-green-600 dark:text-green-400 hover:underline"
                >
                  Modifier
                </router-link>

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
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                Aucune facture trouvée.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div
        v-if="pagination && pagination.last_page > 1"
        class="px-6 py-4 border-t border-gray-300 dark:border-gray-700 flex justify-between items-center"
      >
        <button
          @click="loadInvoices({ page: pagination.current_page - 1 })"
          :disabled="!pagination.prev_page_url"
          class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:text-gray-400 disabled:opacity-50"
        >
          Précédent
        </button>

        <span class="text-sm text-gray-600 dark:text-gray-400">
          Page {{ pagination.current_page }} / {{ pagination.last_page }}
        </span>

        <button
          @click="loadInvoices({ page: pagination.current_page + 1 })"
          :disabled="!pagination.next_page_url"
          class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:text-gray-400 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useInvoiceStore } from "@/stores/invoices";
import { useCurrency } from "@/composables/useCurrency";
import { storeToRefs } from "pinia";
import type { InvoiceQuery } from "@/types";

const invoiceStore = useInvoiceStore();
const { invoices, pagination } = storeToRefs(invoiceStore);
const { deleteInvoice, downloadPDF, fetchInvoices } = invoiceStore;

const { formatCurrency } = useCurrency();

const statsByStatus = computed(() => {
  const stats = { draft: 0, sent: 0, paid: 0, overdue: 0 };

  for (const invoice of invoices.value) {
    stats[invoice.status]++;
  }

  return stats;
});

const kpis = computed(() => [
  {
    label: "Brouillon",
    value: statsByStatus.value.draft,
    bg: "bg-gray-300 dark:bg-gray-700",
    iconBg: "bg-gray-500 dark:bg-gray-600",
  },
  {
    label: "Envoyée",
    value: statsByStatus.value.sent,
    bg: "bg-blue-200 dark:bg-blue-600",
    iconBg: "bg-blue-500 dark:bg-blue-900",
  },
  {
    label: "Payée",
    value: statsByStatus.value.paid,
    bg: "bg-green-100 dark:bg-green-600",
    iconBg: "bg-green-500 dark:bg-green-900",
  },
  {
    label: "En retard",
    value: statsByStatus.value.overdue,
    bg: "bg-red-100 dark:bg-red-400",
    iconBg: "bg-red-500 dark:bg-red-900",
  },
]);
const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    draft: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    sent: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    paid: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300",
    overdue: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return map[status] ?? map.draft;
};

const statusText = (status: string) => {
  const map: Record<string, string> = {
    draft: "Brouillon",
    sent: "Envoyée",
    paid: "Payée",
    overdue: "En retard",
  };

  return map[status] ?? status;
};

const loadInvoices = async (params: InvoiceQuery = {}) => {
  await fetchInvoices(params);
};

const confirmDelete = async (id: number) => {
  if (!confirm("Supprimer cette facture ?")) return;

  await deleteInvoice(id);
  await loadInvoices();
};

onMounted(() => {
  loadInvoices();
});
</script>
