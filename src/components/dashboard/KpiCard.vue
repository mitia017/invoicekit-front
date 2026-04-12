<template>
  <div :class="['p-6 rounded-xl shadow-sm', bg]">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-extrabold text-gray-800 dark:text-gray-50">
          {{ title }}
        </p>

        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ value }}
        </p>

        <p v-if="subtitle" class="text-xs" :class="subtitleClass">
          {{ subtitle }}
        </p>
      </div>

      <div :class="['p-3 rounded-full', iconBg]">
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleClass?: string;
  bg: string;
  iconBg: string;
}>();
</script>
