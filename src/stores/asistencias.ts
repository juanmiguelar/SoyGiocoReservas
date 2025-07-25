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
import { SPREADSHEET_ID, API_KEY, API_BASE, OAUTH_ACCESS_TOKEN } from '../secrets'

const SHEET_NAME = 'asistencias'
let sheetId: number | null = null

export const useAsistenciasStore = defineStore('asistencias', () => {
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
      headers: { 'Authorization': `Bearer ${OAUTH_ACCESS_TOKEN}` }
    })
      const data = await resp.json()
      if (Array.isArray(data.values)) {
        const [hrow, ...rows] = data.values
        headers.value = hrow
        asistencias.value = rows.map(row => {
          const item: any = {}
          hrow.forEach((h: string, i: number) => {
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

  async function getSheetId() {
    if (sheetId !== null) return sheetId
    try {
    const metaUrl = `${API_BASE}/${SPREADSHEET_ID}?fields=sheets.properties&key=${API_KEY}`
    const resp = await fetch(metaUrl, {
      headers: { 'Authorization': `Bearer ${OAUTH_ACCESS_TOKEN}` }
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
      values: [headers.value.map(h => (asistencia as any)[h] || '')]
    }
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OAUTH_ACCESS_TOKEN}`
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
          'Authorization': `Bearer ${OAUTH_ACCESS_TOKEN}`
        },
        body: JSON.stringify(body)
      })
    } catch (err) {
      console.error(err)
    }
  }

  return { asistencias, add, update, remove, fetchRemote }
})
