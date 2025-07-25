import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Asistencia {
  cliente: string
  asistente: string
  taller: string
  disenoElegido: string
  disenoApoyo: string
  disenoRealizado: string
  bienvenida: string
  recordatorio: string
}

const STORAGE_KEY = 'asistencias'

// Configuración para consumir la API de Google Sheets
const SPREADSHEET_ID = '1iPSpOidH44Qev9Woho-VfcAiRXxpn79AT1KgIBkAfTM'
const API_KEY = 'AIzaSyBnP_Bd7VsKsRZ0KfhdGoS7p30oS91iHhk'
const API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
const SHEET_NAME = 'asistencias'

export const useAsistenciasStore = defineStore('asistencias', () => {
  const asistencias = ref<Asistencia[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"))

  watch(asistencias, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  function add(asistencia: Asistencia) {
    asistencias.value.push(asistencia)
  }

  function update(index: number, asistencia: Asistencia) {
    asistencias.value[index] = asistencia
  }

  function remove(index: number) {
    asistencias.value.splice(index, 1)
  }

  async function fetchRemote() {
    try {
      const range = `${SHEET_NAME}!A:Z`
      const url = `${API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`
      const resp = await fetch(url)
      const data = await resp.json()
      if (Array.isArray(data.values)) {
        const [headers, ...rows] = data.values
        asistencias.value = rows.map(row => {
          const item: any = {}
          headers.forEach((h: string, i: number) => {
            item[h] = row[i] || ''
          })
          return item as Asistencia
        })
      } else {
        throw new Error('Respuesta inesperada')
      }
    } catch (err: any) {
      console.error(err)
    }
  }

  return { asistencias, add, update, remove, fetchRemote }
})
