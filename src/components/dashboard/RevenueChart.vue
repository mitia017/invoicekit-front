<template>
  <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Évolution des revenus</h2>

    <div style="height: 375px">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps<{
  data: { month: string; total: number }[];
  formatCurrency: (v: number) => string;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);

let chart: Chart | null = null;

const render = () => {
  if (!canvas.value) return;

  if (chart) chart.destroy();

  chart = new Chart(canvas.value, {
    type: "line",
    data: {
      labels: props.data.map((r) => r.month),
      datasets: [
        {
          label: "Revenus",
          data: props.data.map((r) => r.total),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
  });
};

onMounted(render);
watch(() => props.data, render);
</script>
