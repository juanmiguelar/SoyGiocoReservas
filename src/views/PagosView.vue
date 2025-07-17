<template>
  <v-container>
    <v-btn color="primary" @click="startCreate" class="mb-4">Nuevo Cliente</v-btn>
    <v-data-table :items="pagosStore.pagos" :headers="headers" item-key="cliente">
      <template #item.actions="{ item, index }">
        <v-btn icon="mdi-pencil" @click="editItem(index)" color="primary"></v-btn>
        <v-btn icon="mdi-delete" @click="pagosStore.remove(index)" color="error"></v-btn>
        <router-link :to="{ path: '/asistencias', query: { cliente: item.cliente } }">
          <v-btn small>Ver asistencias</v-btn>
        </router-link>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600">
      <PagoForm :model-value="current" @submit="save" @cancel="dialog=false" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PagoForm from '../components/PagoForm.vue'
import { usePagosStore, Pago } from '../stores/pagos'

const pagosStore = usePagosStore()
const dialog = ref(false)
const current = ref<Pago | null>(null)

const headers = [
  { title: 'Cliente', key: 'cliente' },
  { title: 'Contacto', key: 'contacto' },
  { title: 'Pago1', key: 'pago1' },
  { title: 'Pago2', key: 'pago2' },
  { title: 'Pendientes', key: 'pendientes' },
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

