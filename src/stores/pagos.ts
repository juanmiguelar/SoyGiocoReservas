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
import { useGoogleAuthStore } from './googleAuth'

const SHEET_NAME = 'pagos'
let sheetId: number | null = null
let propToHeader: Record<string, string> = {}
let headerToProp: Record<string, string> = {}

function normalizeHeader(h: string) {
  return h
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ') // to camelCase
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '')
}

function columnLetter(n: number) {
  let s = ''
  while (n > 0) {
    const r = (n - 1) % 26
    s = String.fromCharCode(65 + r) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

export const usePagosStore = defineStore('pagos', () => {
  const authStore = useGoogleAuthStore()
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
    updateRemote(index, pago)
  }

  function remove(index: number) {
    pagos.value.splice(index, 1)
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
        pagos.value = rows.map(row => {
          const item: any = {}
          hrow.forEach((h: string, i: number) => {
            const prop = h2p[h]
            item[prop] = row[i] || ''
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

  async function appendRemote(pago: Pago) {
    if (!headers.value.length) return
    const range = `${SHEET_NAME}!A:Z`
    const url = `${API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`
    const body = {
      values: [headers.value.map(h => (pago as any)[headerToProp[h]] || '')]
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

  async function updateRemote(index: number, pago: Pago) {
    if (!headers.value.length) return
    const row = index + 2
    const lastCol = columnLetter(headers.value.length)
    const range = `${SHEET_NAME}!A${row}:${lastCol}${row}`
    const url = `${API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED&key=${API_KEY}`
    const body = {
      values: [headers.value.map(h => (pago as any)[headerToProp[h]] || '')]
    }
    try {
      await fetch(url, {
        method: 'PUT',
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

  
  return { pagos, add, update, remove, fetchRemote }
})
