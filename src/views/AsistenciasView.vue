<template>
  <v-container>
    <v-btn color="primary" @click="startCreate" class="mb-4">Nueva Asistencia</v-btn>
    <v-data-table
      :items="asistenciasStore.asistencias"
      :headers="headers"
      item-value="cliente"
      show-expand
      expand-icon="mdi-eye"
      v-model:expanded="expanded"
    >
      <template #item.actions="{ index }">
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item @click="editItem(index)">Editar</v-list-item>
            <v-list-item @click="asistenciasStore.remove(index)" class="text-error">Eliminar</v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template #expanded-row="{ item, columns }">
        <tr>
          <td :colspan="columns.length">
            <div class="d-flex flex-column ga-1">
              <div v-for="(value, key) in item" :key="key" v-if="!['Cliente','Diseño'].includes(key)">
                <strong>{{ key }}:</strong> {{ value }}
              </div>
              <router-link :to="{ path: '/pagos', query: { cliente: item.cliente } }">
                <v-btn small class="mt-2">Ver pagos</v-btn>
              </router-link>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600">
      <AsistenciaForm :model-value="current" @submit="save" @cancel="dialog=false" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AsistenciaForm from '../components/AsistenciaForm.vue'
import { useAsistenciasStore, Asistencia } from '../stores/asistencias'

const asistenciasStore = useAsistenciasStore()
const dialog = ref(false)
const current = ref<Asistencia | null>(null)
const expanded = ref<Asistencia[]>([])

onMounted(() => {
  asistenciasStore.fetchRemote()
})

const headers = [
  { title: 'Cliente', key: 'Cliente' },
  { title: 'Diseño', key: 'Diseño' },
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

