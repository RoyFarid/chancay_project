<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">ChancayFlow</h1>
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
    <main class="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- State B: Booking Confirmed (Digital Ticket) -->
      <div v-if="bookingStore.hasBooking" class="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        <!-- Digital Ticket Card (Boarding Pass Style) -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200 flex flex-col flex-1">
          <!-- Header Section -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-2xl font-bold">Puerto de Chancay</h2>
                <p class="text-blue-100 text-sm">Pase de Acceso Digital</p>
              </div>
              <div class="text-right">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4 text-sm">
              <div class="flex-1">
                <p class="text-blue-200">Placa</p>
                <div class="flex items-center space-x-2">
                  <p class="font-bold text-lg">{{ bookingStore.currentBooking.truck_plate }}</p>
                  <!-- Eco Indicator -->
                  <div class="group relative">
                    <svg class="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div class="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                        Vehículo de Bajas Emisiones
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="border-l border-blue-400 pl-4">
                <p class="text-blue-200">ID Reserva</p>
                <p class="font-mono text-xs">{{ bookingStore.currentBooking.booking_id.substring(0, 8) }}</p>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="p-6 flex-1 flex flex-col">
            <!-- Travel Status Banner (Dynamic Travel Assistant) -->
            <TravelStatusBanner
              :status="travelStatus"
              :reason="travelStatusReason"
            />

            <!-- Driver Map -->
            <div class="mt-4 flex-1 min-h-[300px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <DriverMap :status="travelStatus" />
            </div>

            <!-- Routing Instruction -->
            <div class="mb-6 pb-6 border-b border-gray-200 mt-4">
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-500 mb-1">Ruta Asignada</p>
                  <p class="text-lg font-semibold text-gray-900">Acceso Túnel Viaducto - Carril 2</p>
                  <p class="text-xs text-gray-500 mt-1">Siga las señales hacia el túnel principal</p>
                </div>
              </div>
            </div>

            <!-- Customs Status -->
            <div class="mb-6 pb-6 border-b border-gray-200">
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-green-50 rounded-lg">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-500 mb-2">Estado Aduana</p>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Pre-aprobado (Canal Verde)
                  </span>
                  <p class="text-xs text-gray-500 mt-2">Su documentación ha sido verificada. Puede proceder directamente.</p>
                </div>
              </div>
            </div>

            <!-- Dynamic Timing -->
            <div class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900 mb-1">Instrucción de Timing</p>
                  <p class="text-base text-gray-700">
                    Mantener velocidad constante. Su ventana de ingreso en el túnel abre en: 
                    <span class="font-bold text-blue-600">35 min</span>
                  </p>
                  <p class="text-xs text-gray-500 mt-1">Llegue 5 minutos antes de su horario asignado</p>
                </div>
              </div>
            </div>

            <!-- QR Code Section -->
            <div class="bg-gray-50 rounded-lg p-6 text-center mb-6">
              <p class="text-sm font-semibold text-gray-700 mb-4">Código QR de Acceso</p>
              <QRDisplay
                :qr-token="bookingStore.currentBooking.qr_token"
                :booking-id="bookingStore.currentBooking.booking_id"
              />
              <p class="text-xs text-gray-500 mt-4">Presente este código en el punto de control</p>
            </div>

            <!-- Regulatory Compliance Section -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p class="text-sm font-semibold text-gray-700 mb-3">Validaciones Normativas</p>
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-gray-700">MTC/SUTRAN: Habilitado</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-gray-700">Seguro Carga: Activo</span>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-3">Toda su documentación está en orden y verificada</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 space-y-2">
            <!-- Demo Controls -->
            <div v-if="travelStatus === 'GO'" class="grid grid-cols-2 gap-2">
              <button
                @click="simulateIncident"
                class="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                🧪 Simular HOLD
              </button>
              <button
                @click="simulateReroute"
                class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                🗺️ Simular REROUTE
              </button>
            </div>
            
            <button
              v-else-if="travelStatus === 'HOLD'"
              @click="clearIncident"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              ✅ Incidente Resuelto - Continuar
            </button>
            
            <button
              v-else-if="travelStatus === 'REROUTE'"
              @click="acceptReroute"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              ✅ Aceptar Nueva Ruta
            </button>
            
            <button
              @click="handleReset"
              class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Nueva Reserva
            </button>
          </div>
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
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookingStore } from '@/stores/bookingStore'
import SlotCard from '@/components/SlotCard.vue'
import QRDisplay from '@/components/QRDisplay.vue'
import TravelStatusBanner from '@/components/TravelStatusBanner.vue'
import DriverMap from '@/components/driver/DriverMap.vue'

const bookingStore = useBookingStore()

// Travel Status State
const travelStatus = ref('GO') // 'GO', 'HOLD', 'REROUTE'
const travelStatusReason = ref(null)

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
 * Simulate incident (for demo purposes)
 */
const simulateIncident = () => {
  travelStatus.value = 'HOLD'
  travelStatusReason.value = 'Congestión Severa en Acceso Túnel'
}

/**
 * Simulate reroute (for demo purposes)
 */
const simulateReroute = () => {
  travelStatus.value = 'REROUTE'
  travelStatusReason.value = 'Acceso Túnel Viaducto temporalmente cerrado. Use Ruta Alternativa por Carretera Panamericana'
}

/**
 * Clear incident and resume travel
 */
const clearIncident = () => {
  travelStatus.value = 'GO'
  travelStatusReason.value = null
}

/**
 * Accept reroute and continue
 */
const acceptReroute = () => {
  travelStatus.value = 'GO'
  travelStatusReason.value = null
  // In a real app, this would update the route instructions
}

/**
 * Reset booking (for testing)
 */
const handleReset = () => {
  bookingStore.clearBooking()
  travelStatus.value = 'GO'
  travelStatusReason.value = null
  loadSlots()
}

onMounted(() => {
  if (!bookingStore.hasBooking) {
    loadSlots()
  }
})
</script>

