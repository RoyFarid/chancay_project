<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Alertas Activas</h2>
      <span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
        {{ alerts.length }}
      </span>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <div class="space-y-3">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="[
            'rounded-lg p-4 border',
            alert.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
          ]"
        >
          <div class="flex items-start space-x-3">
            <div
              :class="[
                'p-2 rounded-lg',
                alert.severity === 'high' ? 'bg-red-100' : 'bg-yellow-100'
              ]"
            >
              <component
                :is="alert.icon"
                :class="[
                  'w-5 h-5',
                  alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                ]"
              />
            </div>
            <div class="flex-1">
              <h3
                :class="[
                  'font-semibold mb-1',
                  alert.severity === 'high' ? 'text-red-800' : 'text-yellow-800'
                ]"
              >
                {{ alert.title }}
              </h3>
              <p class="text-sm text-gray-600">{{ alert.description }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ alert.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'

const CloudIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' })
])

const ShieldExclamationIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
])

const alerts = ref([
  {
    id: 1,
    title: 'Neblina Intensa',
    description: 'Visibilidad reducida en el área portuaria. Se recomienda precaución en las operaciones.',
    severity: 'medium',
    time: 'Hace 15 minutos',
    icon: CloudIcon,
  },
  {
    id: 2,
    title: 'Sobrecarga en Muelle 2',
    description: 'Capacidad al 95%. Considerar redirección de embarcaciones.',
    severity: 'high',
    time: 'Hace 5 minutos',
    icon: ShieldExclamationIcon,
  },
])
</script>

