<script setup lang="ts">
import type { AppEvent } from '~/types/event'
import { Button } from '@/components/ui/button'
const { 
  events, 
  meta,          // ← add this
  filters, 
  refresh, 
  deleteEvent, 
  updateCount 
} = useEvents()

async function onDelete(id: string) {
  if (confirm('คุณแน่ใจใช่ไหมว่าจะลบกิจกรรมนี้?')) {
    await deleteEvent(id)
    refresh()
  }
}

const isModalOpen = ref(false)
const selectedEvent = ref<AppEvent | null>(null)

function openCreateModal() {
  selectedEvent.value = null
  isModalOpen.value = true
}

function openEdit(eventData: AppEvent) {
  selectedEvent.value = eventData
  isModalOpen.value = true
}

function handleFormSuccess() {
  isModalOpen.value = false
  refresh()
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">ระบบจัดการกิจกรรม (EMS)</h1>
      <button 
        @click="openCreateModal">
        + สร้างกิจกรรมใหม่
      </button>
    </div>

    <FilterBar v-model="filters" />

    <!-- ← add DateRangePicker below FilterBar -->
    <DateRangePicker
      class="mt-3"
      :from="filters.dateFrom ?? ''"
      :to="filters.dateTo ?? ''"
      @update:from="filters.dateFrom = $event; filters.date = ''"
      @update:to="filters.dateTo = $event"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <EventCard
        v-for="e in events" 
        :key="e.id"
        :event="e"
        @delete="onDelete(e.id)"
        @update-count="(d) => updateCount(e.id, d).then(() => refresh())"
        @edit="openEdit(e)"
      />
    </div>

    <div v-if="events.length === 0" class="text-center text-gray-500 py-12">
      ไม่พบกิจกรรมที่คุณกำลังค้นหา
    </div>

    <!-- ← add Pagination below the grid -->
    <AppPagination
      v-if="meta && meta.totalPages > 1"
      :page="meta.page"
      :total-pages="meta.totalPages"
      @update:page="filters.page = $event"
    />

    <!-- ← optional: total count -->
    <p v-if="meta" class="text-center text-sm text-gray-400 mt-3">
      ทั้งหมด {{ meta.total }} กิจกรรม
    </p>

    <EventForm
      v-if="isModalOpen"
      :event="selectedEvent"
      @close="isModalOpen = false"
      @saved="handleFormSuccess"
    />

  </div>
</template>