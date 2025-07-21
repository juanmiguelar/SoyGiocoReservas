import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import fetchJsonp from 'fetch-jsonp'

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
const API_URL = 'https://script.google.com/macros/s/AKfycbwnIipN9UWofaRWAXm-H9k4JFyRqr60GpWTbWvEw2sR6zm-U6LHiJvglmTtJlJA4EZ/exec'
const TOKEN   = 'supersecreto123'

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

  async function fetchRemote() {
    try {
      const resp = await fetchJsonp(
        `${API_URL}?token=${TOKEN}&sheet=pagos`,
        { jsonpCallback: 'callback' }
      )
      const data = await resp.json()
      if (Array.isArray(data.params)) {
        pagos.value = data.params
      } else {
        throw new Error('Respuesta inesperada')
      }
    } catch (err: any) {
      console.error(err)
    }
  }
  

  return { pagos, add, update, remove, fetchRemote }
})
