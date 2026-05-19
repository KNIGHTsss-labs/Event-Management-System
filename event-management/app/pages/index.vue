<script setup lang="ts">
// 1. เรียกใช้งาน Composable ศูนย์บัญชาการที่เราทำกันไว้
const { 
  events, 
  filters, 
  refresh, 
  deleteEvent, 
  updateCount 
} = useEvents()

// 2. ฟังก์ชันสำหรับลบข้อมูล
async function onDelete(id: string) {
  if (confirm('คุณแน่ใจใช่ไหมว่าจะลบกิจกรรมนี้?')) {
    await deleteEvent(id)
    refresh() // โหลดข้อมูลใหม่หลังจากลบเสร็จ
  }
}

// 3. 🌟 ส่วนที่เพิ่มเข้ามา: จัดการระบบ Modal (ข้อ 5) สำหรับสร้าง/แก้ไข
const isModalOpen = ref(false)
const selectedEvent = ref<AppEvent | null>(null) // เก็บข้อมูลงานที่กำลังจะกดแก้ไข

function openCreateModal() {
  selectedEvent.value = null // เคลียร์เป็น null แปลว่าเป็นการ "สร้างใหม่"
  isModalOpen.value = true
}

function openEdit(eventData: AppEvent) {
  selectedEvent.value = eventData // ใส่ข้อมูลงานตัวนี้เข้าไป แปลว่าเป็นการ "แก้ไข"
  isModalOpen.value = true
}

function handleFormSuccess() {
  isModalOpen.value = false
  refresh() // รีเฟรชข้อมูลบนหน้าจอเมื่อกดเซฟเสร็จ
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">ระบบจัดการกิจกรรม (EMS)</h1>
      <button 
        @click="openCreateModal" 
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + สร้างกิจกรรมใหม่
      </button>
    </div>

    <FilterBar v-model="filters" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <EventCard
        v-for="e in events" 
        :key="e.id"
        :event="e"
        @delete="onDelete(e.id)"
        @update-count="(d) => updateCount(e.id, d).then(refresh)"
        @edit="openEdit(e)"
      />
    </div>

    <div v-if="events.length === 0" class="text-center text-gray-500 py-12">
      ไม่พบกิจกรรมที่คุณกำลังค้นหา
    </div>

    <EventForm
      v-if="isModalOpen"
      :event="selectedEvent"
      @close="isModalOpen = false"
      @saved="handleFormSuccess"
    />

    </div>
</template>