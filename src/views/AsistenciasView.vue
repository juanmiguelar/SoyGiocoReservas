<template>
  <v-container>
    <v-btn color="primary" @click="startCreate" class="mb-4">Nueva Asistencia</v-btn>
    <v-data-table :items="asistenciasStore.asistencias" :headers="headers" item-key="cliente">
      <template #item.actions="{ item, index }">
        <v-btn icon="mdi-pencil" @click="editItem(index)" color="primary"></v-btn>
        <v-btn icon="mdi-delete" @click="asistenciasStore.remove(index)" color="error"></v-btn>
        <router-link :to="{ path: '/pagos', query: { cliente: item.cliente } }">
          <v-btn small>Ver pagos</v-btn>
        </router-link>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600">
      <AsistenciaForm :model-value="current" @submit="save" @cancel="dialog=false" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AsistenciaForm from '../components/AsistenciaForm.vue'
import { useAsistenciasStore, Asistencia } from '../stores/asistencias'

const asistenciasStore = useAsistenciasStore()
const dialog = ref(false)
const current = ref<Asistencia | null>(null)

const headers = [
  { title: 'Cliente', key: 'cliente' },
  { title: 'Asistente', key: 'asistente' },
  { title: 'Taller', key: 'taller' },
  { title: 'Diseño Realizado', key: 'disenoRealizado' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

function startCreate() {
  current.value = null
  dialog.value = true
}

function editItem(index: number) {
  current.value = asistenciasStore.asistencias[index]
  dialog.value = true
}

function save(asistencia: Asistencia) {
  if (current.value) {
    const index = asistenciasStore.asistencias.indexOf(current.value)
    asistenciasStore.update(index, asistencia)
  } else {
    asistenciasStore.add(asistencia)
  }
  dialog.value = false
}
</script>

