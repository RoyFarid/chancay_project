import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/axios'

export const useBookingStore = defineStore('booking', () => {
  // State
  const slots = ref([])
  const currentBooking = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const hasBooking = computed(() => currentBooking.value !== null)
  const availableSlotsCount = computed(() => slots.value.length)

  /**
   * Fetch available time slots from the backend
   */
  const fetchSlots = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get('/slots')
      
      if (response.data.success) {
        slots.value = response.data.data || []
        error.value = null
      } else {
        throw new Error(response.data.message || 'Failed to fetch slots')
      }
    } catch (err) {
      // Better error handling with more details
      let errorMessage = 'Error al obtener los horarios disponibles'
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage
        
        if (err.response.status === 500) {
          errorMessage = 'Error del servidor: ' + errorMessage
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:3000'
      } else {
        // Error in request setup
        errorMessage = err.message || errorMessage
      }
      
      error.value = errorMessage
      console.error('Error fetching slots:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        message: errorMessage,
        request: err.request
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new booking
   * @param {number} slotId - The ID of the time slot to book
   * @param {string} truckPlate - The truck license plate
   * @param {number} userId - The user ID (optional, defaults to 3)
   */
  const createBooking = async (slotId, truckPlate, userId = 3) => {
    loading.value = true
    error.value = null
    
    // Validate inputs
    if (!slotId) {
      error.value = 'ID de horario no válido'
      loading.value = false
      throw new Error('ID de horario no válido')
    }
    
    if (!truckPlate || !truckPlate.trim()) {
      error.value = 'La placa del vehículo es requerida'
      loading.value = false
      throw new Error('La placa del vehículo es requerida')
    }
    
    // Clean and validate truck plate
    const cleanTruckPlate = truckPlate.trim()
    if (cleanTruckPlate.length < 3 || cleanTruckPlate.length > 20) {
      error.value = 'La placa debe tener entre 3 y 20 caracteres'
      loading.value = false
      throw new Error('La placa debe tener entre 3 y 20 caracteres')
    }
    
    // Ensure userId is a valid number - force to 3 if invalid
    let cleanUserId;
    if (userId === undefined || userId === null) {
      cleanUserId = 3;
    } else if (typeof userId === 'string' && userId.includes('driver')) {
      // Handle old 'driver-1' format - convert to 3
      cleanUserId = 3;
    } else {
      cleanUserId = Number(userId);
      if (isNaN(cleanUserId) || cleanUserId <= 0) {
        cleanUserId = 3; // Default to 3 if invalid
      }
    }
    
    console.log('Creating booking with:', {
      slotId: Number(slotId),
      userId: cleanUserId,
      originalUserId: userId,
      truckPlate: cleanTruckPlate
    })
    
    try {
      const response = await apiClient.post('/bookings', {
        slot_id: Number(slotId),
        user_id: cleanUserId, // Always send as number
        truck_plate: cleanTruckPlate,
      })
      
      if (response.data.success) {
        currentBooking.value = response.data.data
        // Remove the booked slot from available slots
        slots.value = slots.value.filter(slot => slot.id !== slotId)
        error.value = null
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to create booking')
      }
    } catch (err) {
      // Better error handling
      let errorMessage = 'Error al crear la reserva'
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage
        
        // Handle specific HTTP status codes
        if (err.response.status === 400) {
          errorMessage = 'Datos inválidos: ' + errorMessage
        } else if (err.response.status === 404) {
          errorMessage = 'Horario no encontrado o no disponible'
        } else if (err.response.status === 409) {
          errorMessage = 'Conflicto: ' + errorMessage
        } else if (err.response.status === 500) {
          errorMessage = 'Error del servidor: ' + errorMessage
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.'
      } else {
        // Error in request setup
        errorMessage = err.message || errorMessage
      }
      
      error.value = errorMessage
      console.error('Error creating booking:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        message: errorMessage
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear the current booking (for testing/reset purposes)
   */
  const clearBooking = () => {
    currentBooking.value = null
  }

  /**
   * Reset the store
   */
  const reset = () => {
    slots.value = []
    currentBooking.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    slots,
    currentBooking,
    loading,
    error,
    // Computed
    hasBooking,
    availableSlotsCount,
    // Actions
    fetchSlots,
    createBooking,
    clearBooking,
    reset,
  }
})

