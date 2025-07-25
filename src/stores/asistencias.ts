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
import { SPREADSHEET_ID, API_KEY, API_BASE } from '../secrets'
import { useGoogleAuthStore } from './googleAuth'

const SHEET_NAME = 'asistencias'
let sheetId: number | null = null
let propToHeader: Record<string, string> = {}
let headerToProp: Record<string, string> = {}

function normalizeHeader(h: string) {
  return h
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '')
}

export const useAsistenciasStore = defineStore('asistencias', () => {
  const authStore = useGoogleAuthStore()
  const asistencias = ref<Asistencia[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"))
  const headers = ref<string[]>([])

  watch(asistencias, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  function add(asistencia: Asistencia) {
    asistencias.value.push(asistencia)
    appendRemote(asistencia)
  }

  function update(index: number, asistencia: Asistencia) {
    asistencias.value[index] = asistencia
  }

  function remove(index: number) {
    asistencias.value.splice(index, 1)
    deleteRemote(index)
  }

  async function fetchRemote() {
    try {
      const range = `${SHEET_NAME}!A:Z`
      const url = `${API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`
      const resp = await fetch(url, {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })
      const data = await resp.json()
      if (Array.isArray(data.values)) {
        const [hrow, ...rows] = data.values
        headers.value = hrow
        const h2p: Record<string, string> = {}
        const p2h: Record<string, string> = {}
        hrow.forEach(h => {
          const prop = normalizeHeader(h)
          h2p[h] = prop
          p2h[prop] = h
        })
        headerToProp = h2p
        propToHeader = p2h
        asistencias.value = rows.map(row => {
          const item: any = {}
          hrow.forEach((h: string, i: number) => {
            const prop = h2p[h]
            item[prop] = row[i] || ''
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

  async function getSheetId() {
    if (sheetId !== null) return sheetId
    try {
    const metaUrl = `${API_BASE}/${SPREADSHEET_ID}?fields=sheets.properties&key=${API_KEY}`
    const resp = await fetch(metaUrl, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
      const data = await resp.json()
      const sheet = data.sheets.find((s: any) => s.properties.title === SHEET_NAME)
      sheetId = sheet.properties.sheetId
      return sheetId
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function appendRemote(asistencia: Asistencia) {
    if (!headers.value.length) return
    const range = `${SHEET_NAME}!A:Z`
    const url = `${API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`
    const body = {
      values: [headers.value.map(h => (asistencia as any)[headerToProp[h]] || '')]
    }
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(body)
      })
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteRemote(index: number) {
    const id = await getSheetId()
    if (id === null) return
    const url = `${API_BASE}/${SPREADSHEET_ID}:batchUpdate?key=${API_KEY}`
    const body = {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: id,
              dimension: 'ROWS',
              startIndex: index + 1,
              endIndex: index + 2
            }
          }
        }
      ]
    }
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(body)
      })
    } catch (err) {
      console.error(err)
    }
  }

  return { asistencias, add, update, remove, fetchRemote }
})
