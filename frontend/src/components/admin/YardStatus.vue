<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="block in yardBlocks"
      :key="block.id"
      class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-800 text-sm">{{ block.zone }}</h3>
        <!-- Traffic Light Status -->
        <div class="flex items-center space-x-2">
          <div
            :class="[
              'w-3 h-3 rounded-full',
              getStatusColor(block.status)
            ]"
            :title="block.status === 'open' ? 'Acceso Abierto' : block.status === 'closed' ? 'Acceso Cerrado' : 'Acceso Limitado'"
          ></div>
          <span class="text-xs text-gray-500 capitalize">{{ block.status === 'open' ? 'Abierto' : block.status === 'closed' ? 'Cerrado' : 'Limitado' }}</span>
        </div>
      </div>

      <!-- Occupancy Progress Bar -->
      <div class="mb-3">
        <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Ocupación</span>
          <span class="font-semibold">{{ block.occupancy }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="[
              'h-2 rounded-full transition-all duration-300',
              getOccupancyColor(block.occupancy)
            ]"
            :style="{ width: `${block.occupancy}%` }"
          ></div>
        </div>
      </div>

      <!-- Action Button -->
      <button
        @click="toggleAccess(block.id)"
        :class="[
          'w-full py-2 px-3 text-xs font-medium rounded-lg transition-colors',
          block.status === 'closed'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        ]"
      >
        {{ block.status === 'closed' ? 'Abrir Acceso' : 'Cerrar Acceso' }}
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="yardBlocks.length === 0" class="col-span-2 text-center py-8 text-gray-500">
      <p class="text-sm">No hay bloques de patio configurados</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const yardBlocks = ref([
  {
    id: 1,
    zone: 'Patio Norte - Bloque A',
    status: 'open',
    occupancy: 45,
  },
  {
    id: 2,
    zone: 'Patio Norte - Bloque B',
    status: 'open',
    occupancy: 78,
  },
  {
    id: 3,
    zone: 'Patio Sur - Bloque A',
    status: 'limited',
    occupancy: 92,
  },
  {
    id: 4,
    zone: 'Patio Sur - Bloque B',
    status: 'closed',
    occupancy: 35,
  },
  {
    id: 5,
    zone: 'Patio Este - Bloque A',
    status: 'open',
    occupancy: 62,
  },
  {
    id: 6,
    zone: 'Patio Oeste - Bloque A',
    status: 'open',
    occupancy: 28,
  },
])

const getStatusColor = (status) => {
  const colors = {
    open: 'bg-green-500',
    closed: 'bg-red-500',
    limited: 'bg-yellow-500',
  }
  return colors[status] || 'bg-gray-400'
}

const getOccupancyColor = (occupancy) => {
  if (occupancy > 90) {
    return 'bg-red-500'
  } else if (occupancy < 50) {
    return 'bg-blue-500'
  } else {
    return 'bg-green-500'
  }
}

const toggleAccess = (blockId) => {
  const block = yardBlocks.value.find(b => b.id === blockId)
  if (block) {
    if (block.status === 'closed') {
      block.status = 'open'
    } else {
      block.status = 'closed'
    }
  }
}
</script>

