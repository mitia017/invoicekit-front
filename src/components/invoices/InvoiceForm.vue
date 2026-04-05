<template>
  <form @submit.prevent="submit" class="space-y-6">
    <!-- Client -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client *</label>
      <ClientAutocomplete v-model="form.client_id" />
      <p v-if="errors?.client_id" class="text-red-500 text-sm mt-1">{{ errors.client_id[0] }}</p>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Date d'émission *</label
        >
        <input
          type="date"
          v-model="form.issue_date"
          class="mt-1 block w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <p v-if="errors?.issue_date" class="text-red-500 text-sm mt-1">
          {{ errors.issue_date[0] }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Date d'échéance *</label
        >
        <input
          type="date"
          v-model="form.due_date"
          class="mt-1 block w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <p v-if="errors?.due_date" class="text-red-500 text-sm mt-1">{{ errors.due_date[0] }}</p>
      </div>
    </div>

    <!-- Devise -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Devise *</label>
      <select
        v-model="form.currency"
        class="mt-1 block w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      >
        <option value="EUR">EUR (€)</option>
        <option value="USD">USD ($)</option>
        <option value="MGA">MGA (Ar)</option>
      </select>
      <p v-if="errors?.currency" class="text-red-500 text-sm mt-1">{{ errors.currency[0] }}</p>
    </div>

    <!-- Lignes de facture -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >Lignes de facture *</label
      >
      <div v-for="(item, index) in form.items" :key="index" class="flex gap-2 mb-2 items-start">
        <input
          v-model="item.description"
          placeholder="Description"
          class="flex-1 border rounded-lg px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <input
          type="number"
          v-model="item.quantity"
          step="0.01"
          placeholder="Qté"
          class="w-24 border rounded-lg px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <input
          type="number"
          v-model="item.unit_price"
          step="0.01"
          placeholder="Prix unitaire"
          class="w-32 border rounded-lg px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <input
          type="number"
          v-model="item.tax_rate"
          step="0.1"
          placeholder="TVA %"
          class="w-24 border rounded-lg px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <button
          type="button"
          @click="removeItem(index)"
          class="text-red-500 dark:text-red-400 text-xl leading-5"
        >
          ×
        </button>
      </div>
      <button type="button" @click="addItem" class="text-blue-500 dark:text-blue-400 text-sm">
        + Ajouter une ligne
      </button>
      <p v-if="errors?.items" class="text-red-500 text-sm mt-1">{{ errors.items[0] }}</p>
      <p v-if="errors?.['items.0.description']" class="text-red-500 text-sm mt-1">
        {{ errors["items.0.description"][0] }}
      </p>
    </div>

    <!-- Remise -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Remise</label>
      <div class="flex gap-2">
        <select
          v-model="form.discount_type"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="">Aucune</option>
          <option value="fixed">Montant fixe</option>
          <option value="percent">Pourcentage</option>
        </select>
        <input
          v-if="form.discount_type"
          type="number"
          v-model="form.discount_value"
          step="0.01"
          placeholder="Valeur"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      <p v-if="errors?.discount_type" class="text-red-500 text-sm mt-1">
        {{ errors.discount_type[0] }}
      </p>
      <p v-if="errors?.discount_value" class="text-red-500 text-sm mt-1">
        {{ errors.discount_value[0] }}
      </p>
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
      <textarea
        v-model="form.notes"
        rows="3"
        class="mt-1 block w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      ></textarea>
      <p v-if="errors?.notes" class="text-red-500 text-sm mt-1">{{ errors.notes[0] }}</p>
    </div>

    <!-- Totaux calculés -->
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <p class="dark:text-gray-300">Sous-total : {{ formatCurrency(subtotal) }}</p>
      <p v-if="discountAmount > 0" class="dark:text-gray-300">
        Remise : -{{ formatCurrency(discountAmount) }}
      </p>
      <p class="dark:text-gray-300">
        TVA ({{ form.tax_rate || 0 }}%) : {{ formatCurrency(taxAmount) }}
      </p>
      <p class="font-bold dark:text-white">Total TTC : {{ formatCurrency(total) }}</p>
    </div>

    <!-- Bouton soumission -->
    <div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {{ isEdit ? "Mettre à jour" : "Créer la facture" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useCurrency } from "@/composables/useCurrency";
import ClientAutocomplete from "@/components/clients/ClientAutocomplete.vue";
import type { InvoiceFormData, InvoiceItem } from "@/types";

const props = defineProps<{
  initialData?: Partial<InvoiceFormData>;
  isEdit?: boolean;
  errors?: Record<string, string[]>;
}>();

const emit = defineEmits<{
  (e: "submit", data: InvoiceFormData): void;
}>();

const { formatCurrency } = useCurrency();

// Formulaire réactif : client_id peut être null (en attendant sélection)
const form = reactive({
  client_id: props.initialData?.client_id ?? null,
  issue_date: props.initialData?.issue_date || new Date().toISOString().slice(0, 10),
  due_date: props.initialData?.due_date || "",
  currency: props.initialData?.currency || "EUR",
  tax_rate: props.initialData?.tax_rate || 0,
  items: (props.initialData?.items?.length
    ? props.initialData.items
    : [{ description: "", quantity: 1, unit_price: 0, tax_rate: 0 }]) as InvoiceItem[],
  discount_type: props.initialData?.discount_type || "",
  discount_value: props.initialData?.discount_value || 0,
  notes: props.initialData?.notes || "",
});

// Gestion des lignes
const addItem = () => {
  form.items.push({ description: "", quantity: 1, unit_price: 0, tax_rate: 0 });
};

const removeItem = (index: number) => {
  if (form.items.length > 1) {
    form.items.splice(index, 1);
  } else {
    alert("Au moins une ligne est requise");
  }
};

// Calculs
const subtotal = computed(() => {
  return form.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
});

const discountAmount = computed(() => {
  if (!form.discount_type) return 0;
  if (form.discount_type === "fixed") return form.discount_value || 0;
  if (form.discount_type === "percent") return subtotal.value * ((form.discount_value || 0) / 100);
  return 0;
});

const afterDiscount = computed(() => subtotal.value - discountAmount.value);

const taxAmount = computed(() => afterDiscount.value * ((form.tax_rate || 0) / 100));

const total = computed(() => afterDiscount.value + taxAmount.value);

// Soumission – on s'assure que client_id est un nombre (non null)
const submit = () => {
  // Nettoyer les lignes vides
  const validItems = form.items.filter(
    (item) => item.description.trim() !== "" && item.quantity > 0,
  );

  if (validItems.length === 0) {
    alert("Veuillez ajouter au moins une ligne de facture complète.");
    return;
  }

  if (!form.client_id) {
    alert("Veuillez sélectionner un client.");
    return;
  }

  emit("submit", {
    client_id: form.client_id, // maintenant garanti non null
    issue_date: form.issue_date,
    due_date: form.due_date,
    currency: form.currency,
    items: validItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate || 0,
    })),
    discount_type: form.discount_type || undefined,
    discount_value: form.discount_value || undefined,
    notes: form.notes,
    tax_rate: form.tax_rate,
  });
};
</script>
