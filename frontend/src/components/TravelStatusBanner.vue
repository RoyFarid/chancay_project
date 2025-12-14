<template>
  <div
    :class="[
      'rounded-lg p-4 mb-4 border-2 transition-all duration-300',
      getStatusClasses()
    ]"
  >
    <div class="flex items-center space-x-3">
      <!-- Status Icon -->
      <div :class="['flex-shrink-0', getIconContainerClasses()]">
        <component :is="statusIcon" :class="['w-6 h-6', getIconClasses()]" />
      </div>

      <!-- Status Content -->
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <h3 :class="['font-bold', getTitleClasses(), getTitleSize()]">
            {{ getStatusText() }}
          </h3>
          <span
            v-if="status === 'HOLD'"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-600 text-white animate-pulse"
          >
            ⚠️ URGENTE
          </span>
        </div>
        
        <!-- Reason Display - Enhanced for HOLD -->
        <div v-if="reason" :class="getReasonContainerClasses()">
          <p :class="['font-bold', getReasonClasses()]">
            <span v-if="status === 'HOLD'" class="text-red-900">⚠️ MOTIVO:</span>
            <span v-else>Motivo:</span>
            <span :class="status === 'HOLD' ? 'text-red-800' : ''"> {{ reason }}</span>
          </p>
        </div>
        
        <!-- Additional Info for GO -->
        <p v-if="status === 'GO'" class="text-sm text-green-700 mt-1">
          Puede proceder con normalidad hacia el puerto
        </p>
        
        <!-- Additional Info for REROUTE -->
        <div v-if="status === 'REROUTE'" class="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm font-semibold text-blue-900 mb-1">📋 Nueva Ruta Asignada:</p>
          <p class="text-sm text-blue-800">
            Siga las nuevas indicaciones de ruta. Su GPS será actualizado automáticamente.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['GO', 'HOLD', 'REROUTE'].includes(value),
  },
  reason: {
    type: String,
    default: null,
  },
})

const statusIcon = computed(() => {
  if (props.status === 'GO') {
    return () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 7l5 5m0 0l-5 5m5-5H6' })
    ])
  } else if (props.status === 'HOLD') {
    return () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' })
    ])
  } else {
    return () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' })
    ])
  }
})

const getStatusText = () => {
  const texts = {
    GO: 'Ruta Habilitada',
    HOLD: 'DETENER MARCHA - ESPERAR',
    REROUTE: 'Nueva Ruta Asignada',
  }
  return texts[props.status]
}

const getStatusClasses = () => {
  if (props.status === 'GO') {
    return 'bg-gradient-to-r from-green-100 to-green-200 border-green-400'
  } else if (props.status === 'HOLD') {
    return 'bg-gradient-to-r from-red-200 to-orange-200 border-red-600 border-4 animate-pulse shadow-lg'
  } else {
    return 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-400'
  }
}

const getIconContainerClasses = () => {
  if (props.status === 'GO') {
    return 'p-2 bg-green-500 rounded-full'
  } else if (props.status === 'HOLD') {
    return 'p-2 bg-red-600 rounded-full'
  } else {
    return 'p-2 bg-blue-500 rounded-full'
  }
}

const getIconClasses = () => {
  return 'text-white'
}

const getTitleClasses = () => {
  if (props.status === 'GO') {
    return 'text-green-800'
  } else if (props.status === 'HOLD') {
    return 'text-red-900'
  } else {
    return 'text-blue-800'
  }
}

const getTitleSize = () => {
  if (props.status === 'HOLD') {
    return 'text-2xl md:text-3xl'
  } else {
    return 'text-lg'
  }
}

const getReasonContainerClasses = () => {
  if (props.status === 'HOLD') {
    return 'bg-red-50 border-2 border-red-300 rounded-lg p-3 mt-2'
  } else {
    return 'mt-1'
  }
}

const getReasonClasses = () => {
  if (props.status === 'HOLD') {
    return 'text-red-900 text-base'
  } else if (props.status === 'REROUTE') {
    return 'text-blue-800 text-sm'
  } else {
    return 'text-green-800 text-sm'
  }
}
</script>

<style scoped>
@keyframes pulse-urgent {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse-urgent 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

