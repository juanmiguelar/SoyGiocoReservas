<template>
  <v-container>
    <v-btn color="primary" @click="startCreate" class="mb-4">Nueva Asistencia</v-btn>
    <v-data-table
      :items="asistenciasStore.asistencias"
      :headers="headers"
      item-value="cliente"
      expand-on-click
      :item-props="() => ({ class: 'cursor-pointer' })"
      v-model:expanded="expanded"
    >
      <template #item.actions="{ index }">
        <v-menu @click.stop>
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props" @click.stop></v-btn>
          </template>
          <v-list>
            <v-list-item @click.stop="editItem(index)">Editar</v-list-item>
            <v-list-item @click.stop="asistenciasStore.remove(index)" class="text-error">Eliminar</v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template #expanded-row="{ item, columns }">
        <tr>
          <td :colspan="columns.length">
            <div class="d-flex flex-column ga-1">
              <div v-for="(value, key) in item" :key="key" v-if="!['asistente','ilustracion'].includes(key)">
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
  { title: 'Asistente', key: 'asistente' },
  { title: 'Ilustración', key: 'ilustracion' },
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

