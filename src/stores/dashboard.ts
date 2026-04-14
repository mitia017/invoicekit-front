import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "@/plugins/axios";
import type { AxiosError } from "axios";
import type { ClientStats, RecentInvoiceItem } from "@/types";

export interface DashboardStats {
  total_revenue: number;
  paid_invoices_count: number;
  pending_invoices_count: number;
  monthly_variation: number;
  quarterly_variation: number;
  monthly_progress: number;
  monthly_goal: number;
}

export interface RevenueItem {
  month: string;
  total: number;
}

export const useDashboardStore = defineStore("dashboard", () => {
  // state
  const stats = ref<DashboardStats>({
    total_revenue: 0,
    paid_invoices_count: 0,
    pending_invoices_count: 0,
    monthly_variation: 0,
    quarterly_variation: 0,
    monthly_progress: 0,
    monthly_goal: 0,
  });

  const revenue = ref<RevenueItem[]>([]);
  const topClients = ref<ClientStats[]>([]);
  const recentInvoices = ref<RecentInvoiceItem[]>([]);

  const loading = ref(false);
  const error = ref<string | null>(null);

  // action principale
  const fetchDashboard = async () => {
    loading.value = true;
    error.value = null;

    try {
      const [statsRes, revenueRes, clientsRes, invoicesRes] = await Promise.all([
        axios.get("/api/dashboard/stats"),
        axios.get("/api/dashboard/revenue"),
        axios.get("/api/dashboard/top-clients"),
        axios.get("/api/dashboard/recent-invoices"),
      ]);

      stats.value = {
        ...stats.value,
        ...statsRes.data,
      };

      const revenueData = revenueRes.data as RevenueItem[] | Record<string, RevenueItem>;
      revenue.value = Array.isArray(revenueData)
        ? revenueData
        : Object.values(revenueData).sort((a: RevenueItem, b: RevenueItem) => {
            const monthA = new Date(a.month).getTime();
            const monthB = new Date(b.month).getTime();
            return monthA - monthB;
          });

      topClients.value = clientsRes.data;
      recentInvoices.value = invoicesRes.data;
    } catch (e) {
      const axiosError = e as AxiosError;
      error.value = axiosError?.message || "Erreur chargement dashboard";
    } finally {
      loading.value = false;
    }
  };

  return {
    stats,
    revenue,
    topClients,
    recentInvoices,
    loading,
    error,
    fetchDashboard,
  };
});
