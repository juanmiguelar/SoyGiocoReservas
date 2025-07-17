<template>
  <v-form @submit.prevent="onSubmit" ref="formRef">
    <v-text-field v-model="form.cliente" label="Cliente" :rules="[v=>!!v||'Requerido']" required></v-text-field>
    <v-text-field v-model="form.contacto" label="Contacto"></v-text-field>
    <v-text-field v-model="form.pago1" label="Pago 1"></v-text-field>
    <v-text-field v-model="form.pago2" label="Pago 2"></v-text-field>
    <v-text-field v-model="form.pendientes" label="Pendientes"></v-text-field>
    <v-text-field v-model="form.correo" label="Correo"></v-text-field>
    <v-text-field v-model="form.cedula" label="Cédula"></v-text-field>
    <v-text-field v-model="form.telefono" label="Teléfono"></v-text-field>
    <v-btn type="submit" color="primary" class="mt-2">Guardar</v-btn>
    <v-btn @click="$emit('cancel')" class="mt-2">Cancelar</v-btn>
  </v-form>
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

