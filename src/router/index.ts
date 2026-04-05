import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Dashboard from '@/views/Dashboard.vue'
import InvoicesIndex from '@/views/Invoices/Index.vue'
import InvoiceCreate from '@/views/Invoices/Create.vue'
import InvoiceEdit from '@/views/Invoices/Edit.vue'
import InvoiceShow from '@/views/Invoices/Show.vue'
import ClientsIndex from '@/views/Clients/Index.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const routes = [
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  {
    path: '/',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    component: InvoicesIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/create',
    component: InvoiceCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/:id/edit',
    component: InvoiceEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/:id',
    component: InvoiceShow,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    component: ClientsIndex,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
