<template>
  <div class="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
    <div class="px-6 py-4 border-b dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Meilleurs clients</h2>
    </div>

    <table
      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white"
    >
      <thead class="bg-slate-300 dark:bg-gray-700">
        <tr>
          <th class="px-6 py-3 text-left text-xs uppercase">Client</th>
          <th class="px-6 py-3 text-left text-xs uppercase">Factures</th>
          <th class="px-6 py-3 text-left text-xs uppercase">Total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="c in clients" :key="c.id">
          <td class="px-6 py-4">{{ c.name }}</td>
          <td class="px-6 py-4 text-gray-800 dark:text-gray-300">{{ c.invoices_count }}</td>
          <td class="px-6 py-4">{{ formatCurrency(c.total_spent) }}</td>
        </tr>

        <tr v-if="!clients.length">
          <td colspan="3" class="text-center py-4">Aucun client</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Client } from "@/types";
defineProps<{
  clients: Client[];
  formatCurrency: (v: number) => string;
}>();
</script>
