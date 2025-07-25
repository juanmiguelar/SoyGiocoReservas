<template>
  <v-container>
    <v-btn color="primary" @click="startCreate" class="mb-4">Nuevo Cliente</v-btn>
    <v-data-table
      :items="pagosStore.pagos"
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
            <v-list-item @click="pagosStore.remove(index)" class="text-error">Eliminar</v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template #expanded-row="{ item, columns }">
        <tr>
          <td :colspan="columns.length">
            <div class="d-flex flex-column ga-1">
              <div v-for="(value, key) in item" :key="key" v-if="!['cliente', 'deuda', 'contacto'].includes(key)">
                <strong>{{ key }}:</strong> {{ value }}
              </div>
              <router-link :to="{ path: '/asistencias', query: { cliente: item.idCliente } }">
                <v-btn small class="mt-2">Ver asistencias</v-btn>
              </router-link>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600">
      <PagoForm :model-value="current" @submit="save" @cancel="dialog=false" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PagoForm from '../components/PagoForm.vue'
import { usePagosStore, Pago } from '../stores/pagos'

const pagosStore = usePagosStore()
const dialog = ref(false)
const current = ref<Pago | null>(null)
const expanded = ref<Pago[]>([])

onMounted(() => {
  pagosStore.fetchRemote()
})

const headers = [
  { title: 'Cliente', key: 'cliente' },
  { title: 'Deuda', key: 'deuda' },
  { title: 'Contacto', key: 'contacto' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

function startCreate() {
  current.value = null
  dialog.value = true
}

function editItem(index: number) {
  current.value = pagosStore.pagos[index]
  dialog.value = true
}

function save(pago: Pago) {
  if (current.value) {
    const index = pagosStore.pagos.indexOf(current.value)
    pagosStore.update(index, pago)
  } else {
    pagosStore.add(pago)
  }
  dialog.value = false
}
</script>

