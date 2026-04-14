<template>
  <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activités récentes</h2>

    <div class="space-y-4">
      <div
        v-for="invoice in items"
        :key="invoice.id"
        class="flex items-center justify-between border-b dark:border-gray-700 pb-3"
      >
        <div>
          <p class="font-medium text-gray-800 dark:text-white">
            {{ invoice.number }}
          </p>
          <p class="text-sm text-gray-400">
            {{ invoice.client_name }}
          </p>
        </div>

        <div class="text-right">
          <p class="font-semibold text-gray-800 dark:text-white">
            {{ formatCurrency(invoice.total) }}
          </p>
          <p class="text-xs text-gray-500">
            {{ invoice.created_at }}
          </p>
        </div>
      </div>

      <p v-if="!items.length" class="text-center text-gray-500">Aucune activité récente</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecentInvoiceItem } from "@/types";
defineProps<{
  items: RecentInvoiceItem[];
  formatCurrency: (v: number) => string;
}>();
</script>
