<template>
  <div class="space-y-0">
    <div
      v-for="truck in trucks"
      :key="truck.id"
      class="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors px-4 py-3"
    >
      <div class="flex items-center justify-between">
        <!-- Left: Identity and Status -->
        <div class="flex-1 flex items-center space-x-3">
          <!-- Compliance Icons -->
          <div class="flex items-center space-x-1">
            <div
              v-if="truck.isEco"
              class="p-1"
              title="Vehículo de Bajas Emisiones"
            >
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div
              v-if="truck.isSutran"
              class="p-1"
              title="SUTRAN Habilitado"
            >
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Truck Info -->
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <p class="font-bold text-gray-800">{{ truck.plate }}</p>
              <span
                :class="[
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  getStatusClass(truck.status)
                ]"
              >
                {{ truck.status }}
              </span>
            </div>
            <p class="text-xs text-gray-500">{{ truck.company }}</p>
          </div>
        </div>

        <!-- Right: ETA -->
        <div class="text-right">
          <p class="text-xs text-gray-500">ETA</p>
          <p class="text-sm font-semibold text-gray-800">{{ truck.eta }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="trucks.length === 0" class="text-center py-8 text-gray-500">
      <p class="text-sm">No hay camiones registrados</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  trucks: {
    type: Array,
    default: () => [],
  },
})

const getStatusClass = (status) => {
  const classes = {
    'En Túnel': 'bg-blue-100 text-blue-800',
    'En Espera': 'bg-gray-100 text-gray-800',
    'Fiscalización': 'bg-orange-100 text-orange-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Mock data - en producción esto vendría de un store o API
const trucks = ref([
  {
    id: 1,
    plate: 'C4X-999',
    company: 'Transportes del Norte S.A.',
    status: 'En Túnel',
    eta: '-15 min',
    isEco: true,
    isSutran: true,
  },
  {
    id: 2,
    plate: 'ABC-123',
    company: 'Logística Sur',
    status: 'En Espera',
    eta: '+5 min',
    isEco: false,
    isSutran: true,
  },
  {
    id: 3,
    plate: 'XYZ-456',
    company: 'Fletes Rápidos',
    status: 'Fiscalización',
    eta: '+20 min',
    isEco: true,
    isSutran: false,
  },
  {
    id: 4,
    plate: 'DEF-789',
    company: 'Transportes Unidos',
    status: 'En Túnel',
    eta: '-8 min',
    isEco: true,
    isSutran: true,
  },
])
</script>

