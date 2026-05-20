<script setup lang="ts">
import type { AppEvent } from '~/types/event'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction} from '@/components/ui/alert-dialog'
const {
  events,
  meta,
  filters,
  refresh,
  deleteEvent,
  updateCount
} = useEvents()

//delete confirm state 
const isDeleteOpen = ref(false)
const deleteTargetId = ref<string | null>(null)

function onDelete(id: string) {
  deleteTargetId.value = id
  isDeleteOpen.value = true
}

async function confirmDelete() {
  if (!deleteTargetId.value) return
  await deleteEvent(deleteTargetId.value)
  deleteTargetId.value = null
  isDeleteOpen.value = false
  refresh()
  // if current page is now empyt and we're not on page 1, go back
  if (events.value.length === 0 && filters.page > 1) {
    filters.page = filters.page - 1
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
  <div class="min-h-screen bg-gray-50">

    <!-- HEADER -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">ระบบจัดการกิจกรรม</h1>
          <p class="text-sm text-gray-500 mt-0.5">EMS — Event Management System</p>
        </div>
        <Button @click="openCreateModal">+ สร้างกิจกรรมใหม่</Button>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="max-w-5xl mx-auto px-6 py-6">

      <!-- filter bar -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-4">
        <FilterBar v-model="filters" />
        <DateRangePicker
          class="mt-3"
          :from="filters.dateFrom ?? ''"
          :to="filters.dateTo ?? ''"
          @update:from="filters.dateFrom = $event; filters.date = ''"
          @update:to="filters.dateTo = $event"
        />
      </div>

      <!-- event grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EventCard
          v-for="e in events"
          :key="e.id"
          :event="e"
          @delete="onDelete(e.id)"
          @update-count="(d) => updateCount(e.id, d).then(() => refresh())"
          @edit="openEdit(e)"
        />
      </div>

      <!-- empty state -->
      <div v-if="events.length === 0"
        class="text-center py-20 text-gray-400">
        <p class="text-5xl mb-4">📭</p>
        <p class="text-lg font-medium">ไม่พบกิจกรรม</p>
        <p class="text-sm mt-1">ลองเปลี่ยนตัวกรอง หรือสร้างกิจกรรมใหม่</p>
        <Button class="mt-4" @click="openCreateModal">+ สร้างกิจกรรมแรก</Button>
      </div>

      <!-- pagination + total -->
      <AppPagination
        v-if="meta && meta.totalPages > 1"
        :page="meta.page"
        :total-pages="meta.totalPages"
        @update:page="filters.page = $event"
      />
      <p v-if="meta" class="text-center text-sm text-gray-400 mt-3">
        ทั้งหมด {{ meta.total }} กิจกรรม
      </p>

    </div>
  </div>

  <!-- MODAL — outside the page div so it overlays correctly -->
  <EventForm
    v-if="isModalOpen"
    :event="selectedEvent"
    @close="isModalOpen = false"
    @saved="handleFormSuccess"
  />

  <AlertDialog :open="isDeleteOpen" @update:open="isDeleteOpen = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>ยืนยันการลบกิจกรรม</AlertDialogTitle>
        <AlertDialogDescription>
          คุณแน่ใจหรือไม่? การลบนี้ไม่สามารถย้อนกลับได้
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="isDeleteOpen = false">ยกเลิก</AlertDialogCancel>
        <AlertDialogAction @click="confirmDelete"
          class="bg-red-600 hover:bg-red-700 text-white">
          ลบกิจกรรม
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>