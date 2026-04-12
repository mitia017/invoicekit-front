import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Dashboard from "@/views/Dashboard.vue";
import InvoicesIndex from "@/views/Invoices/Index.vue";
import InvoiceCreate from "@/views/Invoices/Create.vue";
import InvoiceEdit from "@/views/Invoices/Edit.vue";
import InvoiceShow from "@/views/Invoices/Show.vue";
import ClientsIndex from "@/views/Clients/Index.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

const routes = [
  {
    path: "/login",
    component: Login,
    name: "login",
    meta: { guest: true },
  },
  {
    path: "/register",
    component: Register,
    name: "register",
    meta: { guest: true },
  },
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/invoices",
    name: "invoices.list",
    component: InvoicesIndex,
    meta: { requiresAuth: true },
  },
  {
    path: "/invoices/create",
    name: "invoices.create",
    component: InvoiceCreate,
    meta: { requiresAuth: true },
  },
  {
    path: "/invoices/:id/edit",
    name: "invoices.edit",
    component: InvoiceEdit,
    meta: { requiresAuth: true },
  },
  {
    path: "/invoices/:id",
    name: "invoices.show",
    component: InvoiceShow,
    meta: { requiresAuth: true },
  },
  {
    path: "/clients",
    name: "clients.list",
    component: ClientsIndex,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return "/login";
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return "/";
  }

  return true;
});

export default router;
