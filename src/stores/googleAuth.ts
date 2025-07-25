import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_KEY, OAUTH_CLIENT_ID } from '../secrets'

declare const gapi: any
declare const google: any

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4'
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets'

export const useGoogleAuthStore = defineStore('googleAuth', () => {
  const token = ref<string | null>(null)
  const gapiReady = ref(false)
  const gisReady = ref(false)
  let tokenClient: google.accounts.oauth2.TokenClient | null = null

  async function gapiLoaded() {
    console.log('Loading Google API client...')
    await gapi.load('client', async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      })
      gapiReady.value = true
      console.log('Google API client loaded.')
    })
  }

  function gisLoaded() {
    console.log('Initializing Google Identity Services...')
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: OAUTH_CLIENT_ID,
      scope: SCOPES,
      callback: (resp) => {
        if (resp && resp.access_token) {
          console.log('Access token received:', resp.access_token)
          token.value = resp.access_token
        }
      },
    })
    gisReady.value = true
    console.log('Google Identity Services initialized.')
  }

  function signIn() {
    console.log('Signing in with Google OAuth...')
    if (gisReady.value && gapiReady.value && tokenClient) {
      console.log('Requesting access token...')
      tokenClient.requestAccessToken({ prompt: 'consent' })
    }
  }

  function signOut() {
    console.log('Signing out from Google OAuth...')
    token.value = null
  }

  return { token, gapiLoaded, gisLoaded, signIn, signOut }
})
