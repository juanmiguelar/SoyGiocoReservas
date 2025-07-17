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

  return { asistencias, add, update, remove }
})
