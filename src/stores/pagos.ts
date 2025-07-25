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

// Configuración para consumir la API de Google Sheets
const SPREADSHEET_ID = '1iPSpOidH44Qev9Woho-VfcAiRXxpn79AT1KgIBkAfTM'
const API_KEY = 'AIzaSyBnP_Bd7VsKsRZ0KfhdGoS7p30oS91iHhk'
const API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
const SHEET_NAME = 'pagos'

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
      const range = `${SHEET_NAME}!A:Z`
      const url = `${API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`
      const resp = await fetch(url)
      const data = await resp.json()
      if (Array.isArray(data.values)) {
        const [headers, ...rows] = data.values
        pagos.value = rows.map(row => {
          const item: any = {}
          headers.forEach((h: string, i: number) => {
            item[h] = row[i] || ''
          })
          return item as Pago
        })
      } else {
        throw new Error('Respuesta inesperada')
      }
    } catch (err: any) {
      console.error(err)
    }
  }
  

  return { pagos, add, update, remove, fetchRemote }
})
