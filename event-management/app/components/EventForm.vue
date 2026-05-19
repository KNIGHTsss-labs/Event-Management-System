<script setup lang="ts">
// 1. นำเข้า Types ที่เราเตรียมไว้ใน Step 1
import type { AppEvent, CreateEventInput, UpdateEventInput } from '~/types/event'

const props = defineProps<{ event?: AppEvent | null }>()
const emit  = defineEmits(['close', 'saved'])

// 2. ตรวจสอบโหมด: ถ้ามี event ส่งมาแปลว่าเป็นโหมด "แก้ไข"
const isEdit = computed(() => !!props.event)

// 3. สร้าง Reactive Form สำหรับเก็บค่าอินพุต
const form = reactive({
  name: props.event?.name ?? '',
  description: props.event?.description ?? '',
  date: props.event?.date ? props.event.date.substring(0, 16) : '', // ตัดค่าให้เข้ากับ input type="datetime-local"
  location: props.event?.location ?? '',
  maxParticipants: props.event?.maxParticipants ?? null,
})

const { createEvent, updateEvent } = useEvents()
const loading = ref(false)

// 4. ฟังก์ชันส่งข้อมูล
async function submit() {
  loading.value = true
  try {
    if (isEdit.value && props.event) {
      // โหมดแก้ไข: ส่ง ID และข้อมูลที่ต้องการอัปเดต
      await updateEvent(props.event.id, form as UpdateEventInput)
    } else {
      // โหมดสร้างใหม่: ส่งข้อมูลทั้งหมดตาม CreateEventInput
      await createEvent(form as CreateEventInput)
    }
    emit('saved') // บอกให้หน้าหลัก Refresh ข้อมูล
    emit('close') // ปิด Modal
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">
          {{ isEdit ? 'แก้ไขกิจกรรม' : 'สร้างกิจกรรมใหม่' }}
        </h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 transition">
          ✕
        </button>
      </div>

      <form @submit.prevent="submit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อกิจกรรม *</label>
          <input v-model="form.name" type="text" required placeholder="ระบุชื่อกิจกรรมของคุณ"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
          <textarea v-model="form.description" rows="3" placeholder="ระบุรายละเอียดกิจกรรมสั้นๆ"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">วันที่และเวลา *</label>
            <input v-model="form.date" type="datetime-local" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">จำนวนที่รับ (คน)</label>
            <input v-model.number="form.maxParticipants" type="number" placeholder="ไม่ระบุ = ไม่จำกัด"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">สถานที่ *</label>
          <input v-model="form.location" type="text" required placeholder="ระบุสถานที่จัดงาน"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div class="flex gap-3 pt-4">
          <button type="button" @click="emit('close')"
            class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
            ยกเลิก
          </button>
          <button type="submit" :disabled="loading"
            class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition flex justify-center items-center">
            <span v-if="loading" class="animate-spin mr-2">◌</span>
            {{ isEdit ? 'อัปเดตข้อมูล' : 'สร้างกิจกรรม' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>