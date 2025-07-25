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
        <v-text-field v-model="form.asistente" label="Asistente"></v-text-field>
        <v-text-field v-model="form.taller" label="Taller"></v-text-field>
        <v-text-field v-model="form.disenoElegido" label="Diseño Elegido"></v-text-field>
        <v-text-field v-model="form.disenoApoyo" label="Diseño Apoyo"></v-text-field>
        <v-text-field v-model="form.disenoRealizado" label="Diseño Realizado"></v-text-field>
        <v-text-field v-model="form.bienvenida" label="Bienvenida"></v-text-field>
        <v-text-field v-model="form.recordatorio" label="Recordatorio"></v-text-field>
      </div>
      <div class="d-flex justify-end mt-4">
        <v-btn type="submit" color="primary" class="mr-2">Guardar</v-btn>
        <v-btn @click="$emit('cancel')">Cancelar</v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Asistencia } from '../stores/asistencias'
const props = defineProps<{ modelValue: Asistencia | null }>()
const emit = defineEmits(['submit', 'cancel'])

const formRef = ref()
const form = reactive<Asistencia>({
  cliente: '',
  asistente: '',
  taller: '',
  disenoElegido: '',
  disenoApoyo: '',
  disenoRealizado: '',
  bienvenida: '',
  recordatorio: ''
})

onMounted(() => {
  if (props.modelValue) Object.assign(form, props.modelValue)
})

function onSubmit() {
  emit('submit', { ...form })
}
</script>

