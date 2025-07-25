import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useGoogleAuthStore } from './stores/googleAuth'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({ components, directives })

const app = createApp(App)
const pinia = createPinia()
app.use(router).use(pinia).use(vuetify)

const authStore = useGoogleAuthStore(pinia)
window.addEventListener('gapi-loaded', authStore.gapiLoaded)
window.addEventListener('gis-loaded', authStore.gisLoaded)

app.mount('#app')
