<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Virtual Gate</h1>
            <p class="text-sm text-gray-600">Puerto de Chancay</p>
          </div>
          <RouterLink
            to="/"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- State B: Booking Confirmed (Show QR Code) -->
      <div v-if="bookingStore.hasBooking" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Reserva Confirmada</h2>
            <p class="text-gray-600">Muestra este código QR en la entrada del puerto</p>
          </div>

          <!-- QR Code Display -->
          <QRDisplay
            :qr-token="bookingStore.currentBooking.qr_token"
            :booking-id="bookingStore.currentBooking.booking_id"
          />

          <!-- Booking Details -->
          <div class="mt-6 bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Placa del Vehículo</p>
                <p class="font-semibold text-gray-900">{{ bookingStore.currentBooking.truck_plate }}</p>
              </div>
              <div>
                <p class="text-gray-500">ID de Reserva</p>
                <p class="font-semibold text-gray-900 text-xs">{{ bookingStore.currentBooking.booking_id }}</p>
              </div>
            </div>
          </div>

          <!-- Countdown Timer (Mocked) -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500 mb-2">Tiempo restante para el acceso</p>
            <div class="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-lg font-bold text-blue-600">2:45:30</span>
            </div>
          </div>

          <!-- Reset Button (for testing) -->
          <button
            @click="handleReset"
            class="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Nueva Reserva
          </button>
        </div>
      </div>

      <!-- State A: No Booking (Show Available Slots) -->
      <div v-else>
        <!-- Loading State -->
        <div v-if="bookingStore.loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Cargando horarios disponibles...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="bookingStore.error" class="max-w-2xl mx-auto">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-red-800">{{ bookingStore.error }}</p>
            </div>
          </div>
          <button
            @click="loadSlots"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>

        <!-- Slots List -->
        <div v-else>
          <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Horarios Disponibles</h2>
            <p class="text-gray-600">
              {{ bookingStore.availableSlotsCount }} 
              {{ bookingStore.availableSlotsCount === 1 ? 'horario disponible' : 'horarios disponibles' }}
            </p>
          </div>

          <div v-if="bookingStore.slots.length === 0" class="text-center py-12 bg-white rounded-lg">
            <p class="text-gray-500">No hay horarios disponibles en este momento</p>
            <button
              @click="loadSlots"
              class="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Actualizar
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SlotCard
              v-for="slot in bookingStore.slots"
              :key="slot.id"
              :slot="slot"
              @book="handleBookSlot"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookingStore } from '@/stores/bookingStore'
import SlotCard from '@/components/SlotCard.vue'
import QRDisplay from '@/components/QRDisplay.vue'

const bookingStore = useBookingStore()

/**
 * Load available slots on component mount
 */
const loadSlots = async () => {
  try {
    await bookingStore.fetchSlots()
  } catch (error) {
    console.error('Failed to load slots:', error)
  }
}

/**
 * Handle slot booking
 */
const handleBookSlot = async (slotId, truckPlate) => {
  try {
    await bookingStore.createBooking(slotId, truckPlate)
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
    const errorDetails = error.response?.data?.error || ''
    
    console.error('Error completo:', {
      message: errorMessage,
      details: errorDetails,
      response: error.response?.data,
      status: error.response?.status
    })
    
    alert(`Error al crear la reserva:\n\n${errorMessage}${errorDetails ? '\n' + errorDetails : ''}\n\nPor favor, verifica:\n- Que la placa sea válida\n- Que el horario aún esté disponible\n- Tu conexión a internet`)
  }
}

/**
 * Reset booking (for testing)
 */
const handleReset = () => {
  bookingStore.clearBooking()
  loadSlots()
}

onMounted(() => {
  if (!bookingStore.hasBooking) {
    loadSlots()
  }
})
</script>

