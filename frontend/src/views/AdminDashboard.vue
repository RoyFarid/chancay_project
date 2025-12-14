<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AdminHeader />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- KPI Cards Row -->
      <div class="mb-6">
        <KPICardsRow />
      </div>

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Map Section (2 columns) -->
        <div class="lg:col-span-2">
          <MapSection />
        </div>

        <!-- Orchestration Panel (1 column) -->
        <div class="lg:col-span-1">
          <OrchestrationPanel />
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Vessel Tracking -->
        <div>
          <VesselTracking />
        </div>

        <!-- Active Alerts -->
        <div>
          <ActiveAlerts />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminHeader from '@/components/admin/AdminHeader.vue'
import KPICardsRow from '@/components/admin/KPICardsRow.vue'
import MapSection from '@/components/admin/MapSection.vue'
import OrchestrationPanel from '@/components/admin/OrchestrationPanel.vue'
import VesselTracking from '@/components/admin/VesselTracking.vue'
import ActiveAlerts from '@/components/admin/ActiveAlerts.vue'
</script>
