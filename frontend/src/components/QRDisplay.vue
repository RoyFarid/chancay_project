<template>
  <div class="flex flex-col items-center">
    <!-- QR Code Placeholder -->
    <div class="bg-white p-6 rounded-lg border-4 border-gray-900 shadow-2xl mb-4">
      <div class="w-64 h-64 bg-gray-100 flex items-center justify-center relative">
        <!-- QR Code Pattern (Mocked) -->
        <div class="grid grid-cols-8 gap-1 p-4">
          <div
            v-for="i in 64"
            :key="i"
            class="w-full h-full"
            :class="getQRCellClass(i)"
          ></div>
        </div>
        
        <!-- QR Code Overlay Text -->
        <div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <div class="text-center">
            <p class="text-xs font-mono text-gray-600 mb-1">QR Code</p>
            <p class="text-xs font-mono text-gray-400">{{ qrToken.substring(0, 16) }}...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking ID -->
    <div class="text-center">
      <p class="text-xs text-gray-500 mb-1">ID de Reserva</p>
      <p class="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded">
        {{ bookingId.substring(0, 8) }}-{{ bookingId.substring(8, 12) }}-{{ bookingId.substring(12, 16) }}
      </p>
    </div>

    <!-- Instructions -->
    <div class="mt-4 text-center max-w-sm">
      <p class="text-sm text-gray-600">
        Presenta este código QR en la entrada del puerto para acceder a tu horario reservado.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  qrToken: {
    type: String,
    required: true,
  },
  bookingId: {
    type: String,
    required: true,
  },
})

/**
 * Generate a pseudo-random pattern for QR code visualization
 * This is a mocked QR code - in production, use a library like qrcode.js
 */
const getQRCellClass = (index) => {
  // Use the qrToken to generate a deterministic pattern
  const hash = props.qrToken.charCodeAt(index % props.qrToken.length)
  const shouldFill = (hash + index) % 3 === 0
  return shouldFill ? 'bg-gray-900' : 'bg-white'
}
</script>

