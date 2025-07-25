<template>
  <v-card color="white" class="pa-4" style="max-height: 90vh;">
    <v-form
      @submit.prevent="onSubmit"
      ref="formRef"
      class="d-flex flex-column"
      style="height: 100%"
    >
      <div class="flex-grow-1 overflow-y-auto">
        <v-text-field v-model="form.cliente" label="Cliente" :rules="[v=>!!v||'Requerido']" required></v-text-field>
        <v-text-field v-model="form.contacto" label="Contacto"></v-text-field>
        <v-text-field v-model="form.pago1" label="Pago 1"></v-text-field>
        <v-text-field v-model="form.pago2" label="Pago 2"></v-text-field>
        <v-text-field v-model="form.pendientes" label="Pendientes"></v-text-field>
        <v-text-field v-model="form.correo" label="Correo"></v-text-field>
        <v-text-field v-model="form.cedula" label="Cédula"></v-text-field>
        <v-text-field v-model="form.telefono" label="Teléfono"></v-text-field>
      </div>
      <div class="d-flex justify-end mt-4">
        <v-btn type="submit" color="primary" class="mr-2">Guardar</v-btn>
        <v-btn @click="$emit('cancel')">Cancelar</v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { Pago } from '../stores/pagos'
const props = defineProps<{ modelValue: Pago | null }>()
const emit = defineEmits(['submit', 'cancel'])

const formRef = ref()
const form = reactive<Pago>({
  cliente: '',
  contacto: '',
  pago1: '',
  pago2: '',
  pendientes: '',
  correo: '',
  cedula: '',
  telefono: ''
})

onMounted(() => {
  if (props.modelValue) Object.assign(form, props.modelValue)
})

function onSubmit() {
  emit('submit', { ...form })
}
</script>

