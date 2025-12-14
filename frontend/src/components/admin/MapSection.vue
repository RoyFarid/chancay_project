<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Mapa del Puerto - GPS en Tiempo Real</h2>
      <button class="text-gray-600 hover:text-gray-900 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
    </div>

    <!-- Map Placeholder -->
    <div class="flex-1 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
      <!-- Grid Pattern Background -->
      <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
      
      <!-- Center Content -->
      <div class="relative z-10 text-center px-6">
        <div class="mb-6">
          <svg class="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Conectar Mapa en Tiempo Real</h3>
        <p class="text-sm text-gray-600 mb-6">Ingresa tu API key para activar el mapa GPS</p>
        
        <!-- API Key Input -->
        <div class="max-w-md mx-auto">
          <input
            v-model="apiKey"
            type="text"
            placeholder="Ingresa tu API Key"
            class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          />
          <button
            @click="activateMap"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Activar Mapa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const apiKey = ref('')

const activateMap = () => {
  if (apiKey.value.trim()) {
    // TODO: Implement map activation logic
    console.log('Activating map with API key:', apiKey.value)
  }
}
</script>

