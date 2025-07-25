<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>SoyGioco Reservas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/pagos" text>Pagos</v-btn>
      <v-btn to="/asistencias" text>Asistencias</v-btn>
      <v-btn text @click="onAuth">{{ authStore.token ? 'Cerrar sesión' : 'Iniciar sesión' }}</v-btn>
    </v-app-bar>
    <v-main class="ma-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useGoogleAuthStore } from './stores/googleAuth'

const authStore = useGoogleAuthStore()

function onAuth() {
  if (authStore.token) {
    authStore.signOut()
  } else {
    authStore.signIn()
  }
}
</script>
