<script setup lang="ts">
// 1. นำเข้าไทป์ AppEvent ที่เราตั้งไว้
import type { AppEvent } from '~/types/event'

// 2. กำหนด Props และ Emits ให้สอดคล้องกับหน้าหลัก (index.vue)
const props = defineProps<{ event: AppEvent }>()
const emit  = defineEmits(['delete', 'edit', 'update-count'])

// 3. ตรวจสอบว่าจำนวนผู้เข้าร่วมเต็มหรือยัง
const isFull = computed(() =>
  props.event.maxParticipants !== null &&
  props.event.registeredCount >= props.event.maxParticipants
)

// 4. ฟังก์ชันสำหรับแปลงรูปแบบวันที่ (ISO String -> ข้อความอ่านง่าย)
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) + ' น.'
}
</script>

<template>
  <div class="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
    
    <div class="flex justify-between items-start gap-2">
      <h2 class="font-semibold text-lg text-gray-800 line-clamp-1">{{ event.name }}</h2>
      <span v-if="isFull"
        class="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700 shrink-0">
        เต็มแล้ว
      </span>
    </div>

    <div class="mt-2 space-y-1">
      <p class="text-sm text-gray-600 flex items-center gap-1">
        📍 {{ event.location }}
      </p>
      <p class="text-sm text-gray-500 flex items-center gap-1">
        📅 {{ formatDate(event.date) }}
      </p>
      <p v-if="event.description" class="text-sm text-gray-400 italic mt-1 line-clamp-2">
        {{ event.description }}
      </p>
    </div>

    <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <div class="flex items-center gap-3">
        <button @click="emit('update-count', -1)"
          :disabled="event.registeredCount === 0"
          class="w-8 h-8 flex items-center justify-center border rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 transition text-gray-600 font-bold">
          −
        </button>
        
        <span class="text-sm font-medium text-gray-700">
          ผู้สมัคร: <span class="text-base font-bold text-blue-600">{{ event.registeredCount }}</span>
          <span v-if="event.maxParticipants" class="text-gray-400"> / {{ event.maxParticipants }} คน</span>
        </span>
        
        <button @click="emit('update-count', 1)"
          :disabled="isFull"
          class="w-8 h-8 flex items-center justify-center border rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 transition text-gray-600 font-bold">
          +
        </button>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-4 pt-2 border-t border-gray-50">
      <button @click="emit('edit')" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
        แก้ไข
      </button>
      <button @click="emit('delete')" class="text-sm font-medium text-red-500 hover:text-red-700 transition">
        ลบ
      </button>
    </div>

  </div>
</template>