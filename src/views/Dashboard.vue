<template>
  <div class="p-6 bg-gray-200 dark:bg-gray-900 min-h-screen">
    <!-- HEADER -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
      <p class="text-gray-600 dark:text-gray-400">Bienvenue, {{ user?.name }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KpiCard
        title="Chiffre d'affaires"
        :value="formatCurrency(stats.total_revenue || 0)"
        :subtitle="monthlyVariationText + ' vs mois dernier'"
        :subtitleClass="monthlyVariationClass"
        bg="bg-blue-200 dark:bg-blue-600"
        iconBg="bg-blue-500 dark:bg-blue-900"
      >
        <template #icon>
          <DollarSign class="w-6 h-6" />
        </template>
      </KpiCard>

      <KpiCard
        title="Factures payées"
        :value="stats.paid_invoices_count || 0"
        :subtitle="quarterlyVariationText + ' vs trimestre dernier'"
        :subtitleClass="quarterlyVariationClass"
        bg="bg-green-100 dark:bg-green-600"
        iconBg="bg-green-500 dark:bg-green-900"
      >
        <template #icon>
          <Check class="w-6 h-6" />
        </template>
      </KpiCard>

      <KpiCard
        title="Factures en attente"
        :value="stats.pending_invoices_count || 0"
        subtitle="À relancer"
        subtitleClass="text-yellow-600 dark:text-yellow-100"
        bg="bg-amber-100 dark:bg-orange-400"
        iconBg="bg-yellow-500 dark:bg-yellow-800"
      >
        <template #icon>
          <Clock class="w-6 h-6 text-amber-300 dark:text-amber-600" />
        </template>
      </KpiCard>

      <KpiCard
        title="Objectif mensuel"
        :value="stats.monthly_progress + '%'"
        :subtitle="'Objectif : ' + formatCurrency(stats.monthly_goal || 0)"
        subtitleClass="text-blue-600 dark:text-blue-200"
        bg="bg-purple-200 dark:bg-purple-600"
        iconBg="bg-purple-500 dark:bg-purple-900"
      >
        <template #icon>
          <TrendingUp class="w-6 h-6" />
        </template>
      </KpiCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <RevenueChart class="lg:col-span-2" :data="revenue" :formatCurrency="formatCurrency" />

      <RecentActivity :items="recentInvoices" :formatCurrency="formatCurrency" />
    </div>

    <TopClientsTable :clients="topClients" :formatCurrency="formatCurrency" />
  </div>
</template>

<script setup lang="ts">
import KpiCard from "@/components/dashboard/KpiCard.vue";
import RevenueChart from "@/components/dashboard/RevenueChart.vue";
import RecentActivity from "@/components/dashboard/RecentActivity.vue";
import TopClientsTable from "@/components/dashboard/TopClientsTable.vue";
import { Check, Clock, DollarSign, TrendingUp } from "lucide-vue-next";
import { ref, onMounted, nextTick, computed } from "vue";
import { Chart, registerables } from "chart.js";
import { useCurrency } from "@/composables/useCurrency";
import { useAuthStore } from "@/stores/auth";
import { useDashboardStore } from "@/stores/dashboard";
import { storeToRefs } from "pinia";

Chart.register(...registerables);

// stores
const authStore = useAuthStore();
const dashboardStore = useDashboardStore();

const { user } = storeToRefs(authStore);
const { stats, revenue, topClients, recentInvoices } = storeToRefs(dashboardStore);

const { fetchDashboard } = dashboardStore;

// utils
const { formatCurrency } = useCurrency();

// chart
const revenueChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

// variations
const monthlyVariationText = computed(() => {
  const val = stats.value.monthly_variation;
  return `${val >= 0 ? "+" : ""}${val}%`;
});

const monthlyVariationClass = computed(() =>
  stats.value.monthly_variation >= 0
    ? "text-green-600 dark:text-green-200"
    : "text-red-600 dark:text-red-200",
);

const quarterlyVariationText = computed(() => {
  const val = stats.value.quarterly_variation;
  return `${val >= 0 ? "+" : ""}${val}%`;
});

const quarterlyVariationClass = computed(() =>
  stats.value.quarterly_variation >= 0
    ? "text-green-600 dark:text-green-200"
    : "text-red-600 dark:text-red-200",
);

// init
onMounted(async () => {
  await fetchDashboard();

  await nextTick();

  if (revenueChart.value && revenue.value.length) {
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(revenueChart.value, {
      type: "line",
      data: {
        labels: revenue.value.map((r) => r.month),
        datasets: [
          {
            label: "Revenus",
            data: revenue.value.map((r) => r.total),
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
              label: (ctx) => formatCurrency(ctx.raw as number),
            },
          },
        },
      },
    });
  }
});
</script>
