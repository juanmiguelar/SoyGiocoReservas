import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Pago {
  cliente: string
  contacto: string
  pago1: string
  pago2: string
  pendientes: string
  correo: string
  cedula: string
  telefono: string
}

const STORAGE_KEY = 'pagos'

export const usePagosStore = defineStore('pagos', () => {
  const pagos = ref<Pago[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"))
  watch(pagos, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  function add(pago: Pago) {
    pagos.value.push(pago)
  }

  function update(index: number, pago: Pago) {
    pagos.value[index] = pago
  }

  function remove(index: number) {
    pagos.value.splice(index, 1)
  }

  return { pagos, add, update, remove }
})
