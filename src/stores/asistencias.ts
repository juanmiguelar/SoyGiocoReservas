import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import fetchJsonp from 'fetch-jsonp'

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
const API_URL = 'https://script.google.com/macros/s/AKfycbwnIipN9UWofaRWAXm-H9k4JFyRqr60GpWTbWvEw2sR6zm-U6LHiJvglmTtJlJA4EZ/exec'
const TOKEN   = 'supersecreto123'

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
        const resp = await fetchJsonp(
          `${API_URL}?token=${TOKEN}&sheet=pagos`,
          { jsonpCallback: 'callback' }
        )
        const data = await resp.json()
        if (Array.isArray(data.params)) {
          asistencias.value = data.params
        } else {
          throw new Error('Respuesta inesperada')
        }
      } catch (err: any) {
        console.error(err)
      }
    }

  return { asistencias, add, update, remove, fetchRemote }
})
