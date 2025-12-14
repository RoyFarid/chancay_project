<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    <KPICard
      title="Ocupación Puerto"
      value="78%"
      trend="+5.2%"
      trend-color="green"
      icon-name="building"
    />
    <KPICard
      title="Camiones Esperando"
      value="12"
      trend="-3"
      trend-color="red"
      icon-name="truck"
    />
    <KPICard
      title="En Carga"
      value="8"
      icon-name="arrow-path"
    />
    <KPICard
      title="Embarcaciones"
      value="3"
      icon-name="ship"
    />
    <KPICard
      title="Alertas Activas"
      value="2"
      icon-name="alert"
    />
    <KPICard
      title="Eficiencia"
      value="92%"
      trend="+2.1%"
      trend-color="green"
      icon-name="chart"
    />
  </div>
</template>

<script setup>
import KPICard from './KPICard.vue'
</script>

