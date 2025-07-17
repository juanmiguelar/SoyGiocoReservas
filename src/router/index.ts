import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PagosView from '../views/PagosView.vue'
import AsistenciasView from '../views/AsistenciasView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/pagos' },
  { path: '/pagos', component: PagosView },
  { path: '/asistencias', component: AsistenciasView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
