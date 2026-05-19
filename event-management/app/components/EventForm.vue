<script setup lang="ts">
// 1. นำเข้า Types ที่เราเตรียมไว้ใน Step 1
import type { AppEvent, CreateEventInput, UpdateEventInput } from '~/types/event'
import type { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
  if (isEdit.value)
    await updateEvent(props.event!.id, { ...form, date: new Date(form.date).toISOString() })
  else
    await createEvent({ ...form, date:new Date(form.date).toISOString() })
  emit('saved')
}
</script>

<template>
  <Dialog :open="true" @update:open="emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ isEdit ? 'แก้ไขกิจกรรม' : 'สร้างกิจกรรมใหม่' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-3 py-2">
        <div>
          <label class="text-sm font-medium mb-1 block">ชื่อกิจกรรม *</label>
          <Input v-model="form.name" placeholder="ระบุชื่อกิจกรรมของคุณ" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">สถานที่ *</label>
          <Input v-model="form.location" placeholder="ระบุสถานที่จัดงาน/กิจกรรม" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">วันและเวลา *</label>
          <Input type="datetime-local" v-model="form.date" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">รายละเอียด</label>
          <Input v-model="form.description" placeholder="รายละเอียด (ไม่บังคับ)" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">จำนวนผู้เข้าร่วมสูงสุด</label>
          <Input
            type="number" min="0"
            :value="form.maxParticipants ?? ''"
            @input="form.maxParticipants = ($event.target as HTMLInputElement).value
              ? Number(($event.target as HTMLInputElement).value) : null"
            placeholder="ไม่ระบุ = ไม่จำกัด"
          />
        </div>
      </div>

      <DialogFooter class="gap-2">
        <Button variant="outline" @click="emit('close')">ยกเลิก</Button>
        <Button @click="submit">{{ isEdit ? 'อัปเดตข้อมูล' : 'สร้างกิจกรรม' }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>