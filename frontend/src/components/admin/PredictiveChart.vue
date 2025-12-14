<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Proyección de Demanda (Próximas 4 Horas)</h2>
      <button class="text-gray-600 hover:text-gray-900 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Chart Container -->
    <div class="flex-1 relative">
      <!-- Y-Axis Labels -->
      <div class="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-gray-500 pr-2">
        <span>60</span>
        <span>45</span>
        <span>30</span>
        <span>15</span>
        <span>0</span>
      </div>

      <!-- Chart Area -->
      <div class="ml-12 mr-4 h-full relative">
        <!-- Grid Lines -->
        <div class="absolute inset-0 flex flex-col justify-between">
          <div v-for="i in 5" :key="i" class="border-t border-gray-200"></div>
        </div>

        <!-- Chart Content -->
        <div class="relative h-full pt-4 pb-12">
          <!-- X-Axis Labels -->
          <div class="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
            <span>Ahora</span>
            <span>+1h</span>
            <span>+2h</span>
            <span>+3h</span>
          </div>

          <!-- Capacity Limit Line (Dotted Red) -->
          <svg class="absolute inset-0 w-full h-full" style="height: calc(100% - 2rem); top: 1rem;">
            <line
              x1="0"
              y1="60%"
              x2="100%"
              y2="60%"
              stroke="#ef4444"
              stroke-width="2"
              stroke-dasharray="5,5"
              class="opacity-60"
            />
          </svg>

          <!-- Projected Demand Line (Solid Blue) -->
          <svg class="absolute inset-0 w-full h-full" style="height: calc(100% - 2rem); top: 1rem;">
            <polyline
              :points="demandPoints"
              fill="none"
              stroke="#3b82f6"
              stroke-width="3"
              class="drop-shadow-sm"
            />
            <!-- Data Points -->
            <circle
              v-for="(point, index) in demandData"
              :key="index"
              :cx="(index * 33.33) + '%'"
              :cy="(100 - (point / 60 * 100)) + '%'"
              r="5"
              fill="#3b82f6"
              stroke="white"
              stroke-width="2"
            />
          </svg>

          <!-- Warning Label at +2h mark -->
          <div
            v-if="showWarning"
            class="absolute bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg"
            style="left: 66.66%; top: 20%; transform: translateX(-50%); min-width: 200px;"
          >
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 0v2m0-4a2 2 0 100-4 2 2 0 000 4zm0 0v2m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-xs font-semibold text-yellow-800">Alerta Predictiva</p>
                <p class="text-xs text-yellow-700">Saturación en Acceso Túnel (18:00 hrs)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center space-x-2">
        <div class="w-4 h-0.5 bg-blue-600"></div>
        <span class="text-xs text-gray-600">Demanda Proyectada</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-4 h-0.5 bg-red-500 border-dashed border-t-2"></div>
        <span class="text-xs text-gray-600">Límite de Capacidad</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mock data: trucks per hour at each time point
const demandData = ref([25, 35, 45, 50]) // Now, +1h, +2h, +3h
const capacityLimit = 40 // trucks per hour
const showWarning = computed(() => demandData.value[2] > capacityLimit) // +2h mark

// Calculate SVG path points for the demand line
const demandPoints = computed(() => {
  const points = demandData.value.map((value, index) => {
    const x = (index * 33.33) // Percentage position
    const y = 100 - (value / 60 * 100) // Inverted Y (SVG coordinates)
    return `${x}%,${y}%`
  })
  return points.join(' ')
})
</script>

