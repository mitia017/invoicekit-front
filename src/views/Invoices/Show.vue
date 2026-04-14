<template>
  <div class="p-6 max-w-4xl mx-auto dark:bg-gray-900 min-h-screen">
    <!-- Chargement -->
    <div v-if="loading" class="text-center dark:text-white py-10">Chargement de la facture...</div>

    <div v-else-if="invoice">
      <!-- En-tête + actions -->
      <div class="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 class="text-2xl font-bold dark:text-white">Facture {{ invoice.invoice_number }}</h1>
        <div class="space-x-2">
          <!-- PDF -->
          <button
            @click="downloadPDF(invoice.id)"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            PDF
          </button>

          <!-- Envoyer par email -->
          <button
            @click="showSendModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Envoyer
          </button>

          <!-- Payer Stripe (uniquement si non payée) -->
          <button
            v-if="invoice.status !== 'paid'"
            @click="payInvoice"
            :disabled="paying"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {{ paying ? "Redirection..." : "Payer" }}
          </button>
        </div>
      </div>

      <!-- Détails de la facture -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="p-6">
          <!-- Infos client / facture -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-gray-500 dark:text-gray-400">Client</p>
              <p class="font-semibold dark:text-white">{{ invoice.client?.name }}</p>
              <p class="dark:text-gray-300">{{ invoice.client?.email }}</p>
              <p class="dark:text-gray-300">{{ invoice.client?.address }}</p>
            </div>
            <div class="md:text-right">
              <p class="text-gray-500 dark:text-gray-400">N° Facture</p>
              <p class="font-semibold dark:text-white">{{ invoice.invoice_number }}</p>
              <p class="dark:text-gray-300">Date : {{ invoice.issue_date }}</p>
              <p class="dark:text-gray-300">Échéance : {{ invoice.due_date }}</p>
              <p class="mt-2">
                <span :class="statusClass(invoice.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ statusText(invoice.status) }}
                </span>
              </p>
            </div>
          </div>

          <!-- Lignes de facture -->
          <table class="min-w-full mb-6">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left dark:text-gray-300">Description</th>
                <th class="px-4 py-2 text-right dark:text-gray-300">Qté</th>
                <th class="px-4 py-2 text-right dark:text-gray-300">Prix unitaire</th>
                <th class="px-4 py-2 text-right dark:text-gray-300">TVA</th>
                <th class="px-4 py-2 text-right dark:text-gray-300">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in invoice.items" :key="item.id" class="dark:text-white">
                <td class="px-4 py-2">{{ item.description }}</td>
                <td class="px-4 py-2 text-right">{{ item.quantity }}</td>
                <td class="px-4 py-2 text-right">{{ formatCurrency(item.unit_price) }}</td>
                <td class="px-4 py-2 text-right">{{ item.tax_rate }}%</td>
                <td class="px-4 py-2 text-right">{{ formatCurrency(item.amount) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Totaux -->
          <div class="text-right border-t pt-4">
            <p class="dark:text-gray-300">Sous-total : {{ formatCurrency(invoice.subtotal) }}</p>
            <p v-if="invoice.discount_amount > 0" class="dark:text-gray-300">
              Remise : -{{ formatCurrency(invoice.discount_amount) }}
            </p>
            <p class="dark:text-gray-300">
              TVA ({{ invoice.tax_rate }}%) : {{ formatCurrency(invoice.tax_amount) }}
            </p>
            <p class="font-bold text-lg dark:text-white">
              Total : {{ formatCurrency(invoice.total) }}
            </p>
            <p
              v-if="invoice.remaining_amount !== undefined && invoice.remaining_amount > 0"
              class="text-red-600 dark:text-red-400"
            >
              Reste à payer : {{ formatCurrency(invoice.remaining_amount) }}
            </p>
          </div>

          <!-- Notes -->
          <div v-if="invoice.notes" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p class="text-gray-500 dark:text-gray-400">Notes</p>
            <p class="dark:text-gray-300">{{ invoice.notes }}</p>
          </div>

          <!-- Historique des paiements -->
          <div v-if="invoice.payments && invoice.payments.length" class="mt-6">
            <h3 class="font-semibold mb-2 dark:text-white">Paiements reçus</h3>
            <table class="min-w-full">
              <thead>
                <tr>
                  <th class="text-left dark:text-gray-300">Date</th>
                  <th class="text-left dark:text-gray-300">Méthode</th>
                  <th class="text-right dark:text-gray-300">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in invoice.payments" :key="payment.id" class="dark:text-white">
                  <td class="py-1">{{ payment.payment_date }}</td>
                  <td class="py-1">{{ payment.payment_method }}</td>
                  <td class="py-1 text-right">{{ formatCurrency(payment.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== MODAL ENVOI PAR EMAIL ========== -->
    <div
      v-if="showSendModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showSendModal = false"
    >
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4 dark:text-white">Envoyer la facture</h2>
        <input
          type="email"
          v-model="sendEmail"
          placeholder="Email du client"
          class="w-full border rounded-lg px-3 py-2 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <div class="flex justify-end space-x-2">
          <button
            @click="showSendModal = false"
            class="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white"
          >
            Annuler
          </button>
          <button
            @click="sendInvoice"
            :disabled="sending"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ sending ? "Envoi..." : "Envoyer" }}
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center dark:text-white py-10">
      <p class="text-red-600 dark:text-red-400">
        Facture introuvable ou erreur lors du chargement.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/plugins/axios";
import { useCurrency } from "@/composables/useCurrency";
import { useInvoiceStore } from "@/stores/invoices";
import { useNotificationStore } from "@/stores/notifications";
import type { Invoice, ApiErrorResponse } from "@/types";
import type { AxiosError } from "axios";

const route = useRoute();
const router = useRouter();
const { formatCurrency } = useCurrency();
const { downloadPDF } = useInvoiceStore();
const notificationStore = useNotificationStore();

const invoice = ref<Invoice | null>(null);
const loading = ref(true);

const showSendModal = ref(false);
const sendEmail = ref("");
const sending = ref(false);
const paying = ref(false);

const getId = (): number => Number(route.params.id);

const fetchInvoice = async () => {
  try {
    const { data } = await axios.get<Invoice>(`/api/invoices/${getId()}`);
    invoice.value = data;
  } catch (err) {
    notificationStore.handleApiError(err, "Impossible de charger la facture.");
  } finally {
    loading.value = false;
  }
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

const sendInvoice = async () => {
  if (!invoice.value || !sendEmail.value) return;

  sending.value = true;

  try {
    await axios.post(`/api/invoices/${invoice.value.id}/send`, {
      email: sendEmail.value,
    });

    showSendModal.value = false;
    sendEmail.value = "";
    notificationStore.success("Facture envoyée avec succès.");
    await fetchInvoice();
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    notificationStore.handleApiError(error, "Échec de l'envoi.");
  } finally {
    sending.value = false;
  }
};

const payInvoice = async () => {
  if (!invoice.value) return;

  paying.value = true;

  try {
    const { data } = await axios.post(`/api/invoices/${invoice.value.id}/checkout`, {
      success_url: window.location.href,
      cancel_url: window.location.href,
    });

    window.location.href = data.url;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    notificationStore.handleApiError(error, "Impossible de lancer le paiement.");
    paying.value = false;
  }
};

const checkStripeReturn = () => {
  const status = route.query.payment;

  if (status === "success") {
    notificationStore.success("Paiement validé.");
    fetchInvoice();
    router.replace({ query: {} });
  }

  if (status === "cancel") {
    notificationStore.warning("Paiement annulé.");
    router.replace({ query: {} });
  }
};

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    sent: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return map[status] ?? map.draft;
};

onMounted(async () => {
  await fetchInvoice();
  checkStripeReturn();
});
</script>
