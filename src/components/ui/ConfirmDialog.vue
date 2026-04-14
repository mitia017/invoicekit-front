<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <transition name="scale">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96">
            <!-- Header -->
            <div class="px-6 py-4 border-b dark:border-gray-700 flex items-center">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
              </div>
              <button
                @click="cancel"
                class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <!-- Content -->
            <div class="px-6 py-4">
              <p class="text-gray-600 dark:text-gray-400">{{ message }}</p>
            </div>

            <!-- Footer with actions -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end gap-3">
              <button
                @click="cancel"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition"
              >
                Annuler
              </button>
              <button
                @click="confirm"
                :disabled="isLoading"
                class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {{ isLoading ? "Suppression..." : actionLabel }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  title?: string;
  message?: string;
  actionLabel?: string;
  isOpen?: boolean;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Confirmation",
  message: "Êtes-vous sûr de vouloir effectuer cette action ?",
  actionLabel: "Supprimer",
  isOpen: false,
  isLoading: false,
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const isLoading = ref(props.isLoading);

const confirm = () => {
  emit("confirm");
};

const cancel = () => {
  emit("cancel");
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
