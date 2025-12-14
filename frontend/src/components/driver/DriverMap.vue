<template>
  <div id="driver-map-container" class="w-full flex-1 min-h-[400px] relative z-0"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['GO', 'HOLD', 'REROUTE'].includes(value),
  },
})

let map = null
let primaryRoute = null
let alternateRoute = null
let startMarker = null
let portMarker = null
let reroutePopup = null

// Fix Leaflet default icon issue
const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

// Mock route coordinates (Primary - Panamericana Norte)
// Camión a la derecha (este) del puerto, en carretera
const routePrimary = [
  [-11.56, -77.25], // Start point (a la derecha del puerto, en carretera)
  [-11.561, -77.26], // Continúa por carretera hacia el puerto
  [-11.562, -77.27], // Aproximándose al puerto
  [-11.562, -77.275], // Puerto de Chancay
]

// Mock route coordinates (Alternate - Variante/Desvío)
const routeAlt = [
  [-11.56, -77.25], // Start point (same start)
  [-11.565, -77.24], // Desvío hacia el sur-este (inland)
  [-11.57, -77.23],
  [-11.575, -77.24], // Detour point (más al sur-este)
  [-11.57, -77.26],
  [-11.565, -77.27],
  [-11.562, -77.275], // Back to port
]

// Puerto de Chancay coordinates
const portCoords = [-11.562, -77.275]

const initializeMap = async () => {
  await nextTick()
  
  fixLeafletIcons()
  
  // Initialize map centered on Chancay
  map = L.map('driver-map-container').setView([-11.56, -77.27], 13)
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)
  
  // Add start marker (current location)
  startMarker = L.marker([routePrimary[0][0], routePrimary[0][1]], {
    icon: L.divIcon({
      className: 'custom-start-marker',
      html: '<div style="background: #3b82f6; color: white; padding: 6px 10px; border-radius: 50%; font-size: 12px; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🚛</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })
  }).addTo(map).bindPopup('<b>Su Ubicación</b><br>Punto de inicio')
  
  // Add port marker
  portMarker = L.marker(portCoords, {
    icon: L.divIcon({
      className: 'custom-port-marker',
      html: '<div style="background: #10b981; color: white; padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">⚓ Puerto</div>',
      iconSize: [80, 30],
      iconAnchor: [40, 15],
    })
  }).addTo(map).bindPopup('<b>Puerto de Chancay</b><br>Destino')
  
  // Draw primary route
  drawPrimaryRoute()
  
  // Fit map to show entire route
  const routeBounds = L.latLngBounds(routePrimary)
  map.fitBounds(routeBounds, { padding: [50, 50] })
}

const drawPrimaryRoute = () => {
  // Remove existing routes
  if (primaryRoute) {
    map.removeLayer(primaryRoute)
  }
  if (alternateRoute) {
    map.removeLayer(alternateRoute)
  }
  
  // Draw blue primary route
  primaryRoute = L.polyline(routePrimary, {
    color: '#3b82f6',
    weight: 5,
    opacity: 0.8,
    smoothFactor: 1,
  }).addTo(map)
  
  // Add route label
  const midPoint = routePrimary[Math.floor(routePrimary.length / 2)]
  L.marker(midPoint, {
    icon: L.divIcon({
      className: 'route-label',
      html: '<div style="background: rgba(59, 130, 246, 0.9); color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; white-space: nowrap;">Ruta Principal</div>',
      iconSize: [100, 20],
      iconAnchor: [50, 10],
    })
  }).addTo(map)
}

const drawAlternateRoute = () => {
  // Remove primary route
  if (primaryRoute) {
    map.removeLayer(primaryRoute)
  }
  if (alternateRoute) {
    map.removeLayer(alternateRoute)
  }
  
  // Draw orange/purple alternate route
  alternateRoute = L.polyline(routeAlt, {
    color: '#f97316',
    weight: 6,
    opacity: 0.9,
    smoothFactor: 1,
    dashArray: '10, 5',
  }).addTo(map)
  
  // Add reroute popup at detour point
  const detourPoint = routeAlt[3] // The detour point
  if (reroutePopup) {
    map.removeLayer(reroutePopup)
  }
  
  reroutePopup = L.marker(detourPoint, {
    icon: L.divIcon({
      className: 'reroute-popup-marker',
      html: '<div style="background: #f97316; color: white; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); animation: pulse 2s infinite;">⚠️ Desvío Activo</div>',
      iconSize: [120, 35],
      iconAnchor: [60, 17],
    })
  }).addTo(map).bindPopup('<b>⚠️ Desvío Activo</b><br>Ruta alternativa activada')
  
  // Add route label
  const altMidPoint = routeAlt[Math.floor(routeAlt.length / 2)]
  L.marker(altMidPoint, {
    icon: L.divIcon({
      className: 'route-label-alt',
      html: '<div style="background: rgba(249, 115, 22, 0.9); color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; white-space: nowrap;">Ruta Alternativa</div>',
      iconSize: [120, 20],
      iconAnchor: [60, 10],
    })
  }).addTo(map)
  
  // Fly to fit the new route bounds
  const altBounds = L.latLngBounds(routeAlt)
  map.flyToBounds(altBounds, {
    padding: [50, 50],
    duration: 1.5,
  })
}

// Watch for status changes
watch(() => props.status, (newStatus) => {
  if (!map) return
  
  if (newStatus === 'REROUTE') {
    drawAlternateRoute()
  } else if (newStatus === 'GO' || newStatus === 'HOLD') {
    drawPrimaryRoute()
    // Fit to primary route
    const routeBounds = L.latLngBounds(routePrimary)
    map.flyToBounds(routeBounds, {
      padding: [50, 50],
      duration: 1,
    })
  }
})

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
#driver-map-container {
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Fix Leaflet z-index issues */
:deep(.leaflet-container) {
  z-index: 0;
}

/* Pulse animation for reroute marker */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
</style>

