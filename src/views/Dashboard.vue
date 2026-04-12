<template>
  <div class="p-6 bg-gray-200 dark:bg-gray-900 min-h-screen">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
      <p class="text-gray-600 dark:text-gray-400">Bienvenue, {{ user?.name }} !</p>
    </div>

    <!-- Cartes KPI -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Chiffre d'affaires -->
      <div class="bg-blue-200 dark:bg-blue-600 p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-800 font-extrabold dark:text-gray-50">Chiffre d'affaires</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(stats.total_revenue || 0) }}
            </p>
            <p class="text-xs" :class="monthlyVariationClass">
              {{ monthlyVariationText }} vs mois dernier
            </p>
          </div>
          <div class="p-3 bg-blue-500 dark:bg-blue-900 rounded-full">
            <svg class="w-6 h-6 text-blue-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Factures payées -->
      <div class="bg-green-100 dark:bg-green-600 p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-800 font-extrabold dark:text-gray-50">Factures payées</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.paid_invoices_count || 0 }}
            </p>
            <p class="text-xs" :class="quarterlyVariationClass">
              {{ quarterlyVariationText }} vs trimestre dernier
            </p>
          </div>
          <div class="p-3 bg-green-500 dark:bg-green-900 rounded-full">
            <svg
              class="w-6 h-6 text-green-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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

      <!-- Factures en attente -->
      <div class="bg-amber-100 dark:bg-orange-400 p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-800 font-extrabold dark:text-gray-50">
              Factures en attente
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.pending_invoices_count || 0 }}
            </p>
            <p class="text-xs text-yellow-600 dark:text-yellow-100 mt-1">À relancer</p>
          </div>
          <div class="p-3 bg-yellow-500 dark:bg-yellow-900 rounded-full">
            <svg
              class="w-6 h-6 text-yellow-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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

      <!-- Objectif mensuel -->
      <div class="bg-purple-200 dark:bg-purple-600 p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-800 font-extrabold dark:text-gray-50">Objectif mensuel</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.monthly_progress || 0 }}%
            </p>
            <p class="text-xs text-blue-600 dark:text-blue-200 mt-1">
              Objectif : {{ formatCurrency(stats.monthly_goal || 0) }}
            </p>
          </div>
          <div class="p-3 bg-purple-500 dark:bg-purple-900 rounded-full">
            <svg
              class="w-6 h-6 text-purple-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphique + activités récentes -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Graphique -->
      <div class="lg:col-span-2 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Évolution des revenus
        </h2>
        <div style="height: 375px">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>

      <!-- Activités récentes -->
      <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activités récentes</h2>
        <div class="space-y-4">
          <div
            v-for="invoice in recentInvoices"
            :key="invoice.id"
            class="flex items-center justify-between border-b dark:border-gray-700 pb-3"
          >
            <div>
              <p class="font-medium text-gray-800 dark:text-white">{{ invoice.number }}</p>
              <p class="text-sm text-gray-800 dark:text-gray-400">{{ invoice.client_name }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(invoice.total) }}
              </p>
              <p class="text-xs text-gray-800">{{ invoice.created_at }}</p>
            </div>
          </div>
          <p v-if="!recentInvoices.length" class="text-gray-800 text-center py-4">
            Aucune activité récente
          </p>
        </div>
      </div>
    </div>

    <!-- Meilleurs clients -->
    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Meilleurs clients</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-slate-300 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase"
              >
                Client
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase"
              >
                Factures
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase"
              >
                Total dépensé
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="client in topClients" :key="client.id">
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ client.name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-800 dark:text-gray-400">
                {{ client.invoices_count }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                {{ formatCurrency(client.total_spent) }}
              </td>
            </tr>
            <tr v-if="!topClients.length">
              <td colspan="3" class="px-6 py-4 text-center text-gray-800 dark:text-gray-400">
                Aucun client
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue";
import { Chart, registerables } from "chart.js";
import axios from "@/plugins/axios";
import { useCurrency } from "@/composables/useCurrency";
import { useAuthStore } from "@/stores/auth";

Chart.register(...registerables);

const { formatCurrency } = useCurrency();
const authStore = useAuthStore();
const user = ref(authStore.user);

const stats = ref({
  total_revenue: 0,
  paid_invoices_count: 0,
  pending_invoices_count: 0,
  monthly_variation: 0,
  quarterly_variation: 0,
  monthly_progress: 0,
  monthly_goal: 0,
});
const monthlyRevenue = ref<any[]>([]);
const topClients = ref<any[]>([]);
const recentInvoices = ref<any[]>([]);
const revenueChart = ref<HTMLCanvasElement | null>(null);
const monthlyVariationText = computed(() => {
  const val = stats.value.monthly_variation;
  if (val === undefined) return "+0.0%";
  return `${val >= 0 ? "+" : ""}${val}%`;
});
const monthlyVariationClass = computed(() => {
  const val = stats.value.monthly_variation;
  if (val === undefined) return "";
  return val >= 0 ? "text-green-600 dark:text-green-200" : "text-red-600 dark:text-red-200";
});
const quarterlyVariationText = computed(() => {
  const val = stats.value.quarterly_variation;
  if (val === undefined) return "+0.0%";
  return `${val >= 0 ? "+" : ""}${val}%`;
});
const quarterlyVariationClass = computed(() => {
  const val = stats.value.quarterly_variation;
  if (val === undefined) return "";
  return val >= 0 ? "text-green-600 dark:text-green-200" : "text-red-600 dark:text-red-200";
});

onMounted(async () => {
  try {
    const [statsRes, revenueRes, clientsRes, invoicesRes] = await Promise.all([
      axios.get("/api/dashboard/stats"),
      axios.get("/api/dashboard/revenue"),
      axios.get("/api/dashboard/top-clients"),
      axios.get("/api/dashboard/recent-invoices"),
    ]);

    // Mise à jour avec les nouvelles clés
    stats.value = { ...stats.value, ...statsRes.data };
    console.log("Stats reçues :", stats.value);
    const revenueData = revenueRes.data;
    monthlyRevenue.value = Array.isArray(revenueData) ? revenueData : Object.values(revenueData);
    topClients.value = clientsRes.data;
    recentInvoices.value = invoicesRes.data;

    await nextTick();
    if (revenueChart.value && monthlyRevenue.value.length) {
      new Chart(revenueChart.value, {
        type: "line",
        data: {
          labels: monthlyRevenue.value.map((r) => r.month),
          datasets: [
            {
              label: "Revenus",
              data: monthlyRevenue.value.map((r) => r.total),
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => `${formatCurrency(ctx.raw as number)}`,
              },
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("Erreur chargement dashboard", error);
  }
});
</script>
