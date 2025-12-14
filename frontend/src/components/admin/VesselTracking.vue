<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Embarcaciones</h2>
      <button class="text-gray-600 hover:text-gray-900 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <div class="space-y-4">
        <div
          v-for="vessel in vessels"
          :key="vessel.id"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <h3 class="text-gray-900 font-semibold">{{ vessel.name }}</h3>
                <!-- Green/Electric Indicator -->
                <div
                  v-if="vessel.isGreen"
                  class="group relative"
                  title="Flota Eléctrica / Vehículo de Bajas Emisiones"
                >
                  <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p class="text-sm text-gray-600">{{ vessel.origin }}</p>
            </div>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded',
                vessel.status === 'Atracado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]"
            >
              {{ vessel.status }}
            </span>
          </div>

          <div class="mb-3">
            <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>ETA: {{ vessel.eta }}</span>
              <span>{{ vessel.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="[
                  'h-2 rounded-full transition-all duration-300',
                  vessel.status === 'Atracado' ? 'bg-green-500' : 'bg-yellow-500'
                ]"
                :style="{ width: `${vessel.progress}%` }"
              ></div>
            </div>
          </div>

          <div class="text-xs text-gray-600">
            {{ vessel.operation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const vessels = ref([
  {
    id: 1,
    name: 'COSCO Chancay',
    origin: 'Shanghai, China',
    eta: '14:30',
    status: 'En aproximación',
    progress: 75,
    operation: 'Carga de contenedores',
    isGreen: false,
  },
  {
    id: 2,
    name: 'MSC Pacific',
    origin: 'Los Angeles, USA',
    eta: '16:45',
    status: 'Atracado',
    progress: 45,
    operation: 'Descarga en proceso',
    isGreen: true, // Green/Electric fleet
  },
  {
    id: 3,
    name: 'Maersk Lima',
    origin: 'Rotterdam, Holanda',
    eta: '18:20',
    status: 'En aproximación',
    progress: 60,
    operation: 'Carga programada',
    isGreen: true, // Green/Electric fleet
  },
])
</script>

