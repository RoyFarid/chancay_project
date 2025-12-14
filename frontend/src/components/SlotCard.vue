<template>
  <div
    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden cursor-pointer"
    @click="handleClick"
  >
    <div class="p-5">
      <!-- Time Display -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-lg font-bold text-gray-900">{{ formatTime(slot.start_time) }}</span>
          <span class="text-gray-500">-</span>
          <span class="text-lg font-bold text-gray-900">{{ formatTime(slot.end_time) }}</span>
        </div>
        <span
          v-if="slot.status === 'OPEN'"
          class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
        >
          Disponible
        </span>
      </div>

      <!-- Availability Info -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Espacios disponibles:</span>
          <span class="font-semibold text-blue-600">{{ slot.available_spots }} / {{ slot.capacity }}</span>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(slot.available_spots / slot.capacity) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Book Button -->
      <button
        v-if="slot.available_spots > 0"
        class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        @click.stop="handleClick"
      >
        Reservar Horario
      </button>
      <div
        v-else
        class="mt-4 w-full bg-gray-300 text-gray-600 font-medium py-2 px-4 rounded-lg text-center cursor-not-allowed"
      >
        Sin disponibilidad
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  slot: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['book'])

/**
 * Format time string to readable format
 */
const formatTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return date.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Handle slot click/booking
 */
const handleClick = () => {
  if (props.slot.available_spots > 0) {
    // Prompt for truck plate with better validation
    const truckPlate = prompt('Ingresa la placa del vehículo:\n\nEjemplo: ABC-123, XYZ-456')
    if (truckPlate && truckPlate.trim()) {
      const cleanedPlate = truckPlate.trim().toUpperCase()
      // Basic validation
      if (cleanedPlate.length < 3) {
        alert('La placa debe tener al menos 3 caracteres')
        return
      }
      if (cleanedPlate.length > 20) {
        alert('La placa no puede tener más de 20 caracteres')
        return
      }
      emit('book', props.slot.id, cleanedPlate)
    }
  }
}
</script>

