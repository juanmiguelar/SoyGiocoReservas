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
import { SPREADSHEET_ID, API_KEY, API_BASE } from '../secrets'

const SHEET_NAME = 'pagos'
let sheetId: number | null = null

export const usePagosStore = defineStore('pagos', () => {
  const pagos = ref<Pago[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"))
  const headers = ref<string[]>([])
  watch(pagos, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  function add(pago: Pago) {
    pagos.value.push(pago)
    appendRemote(pago)
  }

  function update(index: number, pago: Pago) {
    pagos.value[index] = pago
  }

  function remove(index: number) {
    pagos.value.splice(index, 1)
    deleteRemote(index)
  }

  async function fetchRemote() {
    try {
      const range = `${SHEET_NAME}!A:Z`
      const url = `${API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`
      const resp = await fetch(url)
      const data = await resp.json()
      if (Array.isArray(data.values)) {
        const [hrow, ...rows] = data.values
        headers.value = hrow
        pagos.value = rows.map(row => {
          const item: any = {}
          hrow.forEach((h: string, i: number) => {
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

  async function getSheetId() {
    if (sheetId !== null) return sheetId
    try {
      const metaUrl = `${API_BASE}/${SPREADSHEET_ID}?fields=sheets.properties&key=${API_KEY}`
      const resp = await fetch(metaUrl)
      const data = await resp.json()
      const sheet = data.sheets.find((s: any) => s.properties.title === SHEET_NAME)
      sheetId = sheet.properties.sheetId
      return sheetId
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function appendRemote(pago: Pago) {
    if (!headers.value.length) return
    const range = `${SHEET_NAME}!A:Z`
    const url = `${API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`
    const body = {
      values: [headers.value.map(h => (pago as any)[h] || '')]
    }
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    } catch (err) {
      console.error(err)
    }
  }

  
  return { pagos, add, update, remove, fetchRemote }
})
