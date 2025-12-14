<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
    <!-- Tabs -->
    <div class="flex border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium transition-colors',
          activeTab === tab.id
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="activeTab === 'orchestration'">
        <h3 class="text-sm font-semibold text-gray-600 mb-4 uppercase">Gestiones</h3>
        <div class="space-y-3">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div class="flex items-start justify-between mb-2">
              <div>
                <h4 class="text-gray-900 font-semibold">{{ task.title }}</h4>
                <span
                  :class="[
                    'inline-block mt-1 px-2 py-1 text-xs font-medium rounded',
                    task.status === 'Por confirmar' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ task.status }}
                </span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">{{ task.description }}</p>
            <button
              class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'trucks'" class="text-center py-8">
        <p class="text-gray-600">Vista de camiones</p>
      </div>

      <div v-else-if="activeTab === 'piles'" class="text-center py-8">
        <p class="text-gray-600">Vista de pilas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('orchestration')

const tabs = [
  { id: 'orchestration', label: 'Orquestación' },
  { id: 'trucks', label: 'Camiones' },
  { id: 'piles', label: 'Pilas' },
]

const tasks = [
  {
    id: 3001,
    title: 'Gestión #3001',
    status: 'Por confirmar',
    description: 'Descarga de contenedores - Muelle 3',
  },
  {
    id: 3002,
    title: 'Gestión #3002',
    status: 'Por confirmar',
    description: 'Carga de mercancía - Almacén A',
  },
  {
    id: 3003,
    title: 'Gestión #3003',
    status: 'Por confirmar',
    description: 'Reubicación de contenedores - Patio 2',
  },
  {
    id: 3004,
    title: 'Gestión #3004',
    status: 'Por confirmar',
    description: 'Inspección de carga - Muelle 1',
  },
]
</script>

