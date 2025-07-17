<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>SoyGioco Reservas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/pagos" text>Pagos</v-btn>
      <v-btn to="/asistencias" text>Asistencias</v-btn>
    </v-app-bar>
    <v-main class="ma-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>
