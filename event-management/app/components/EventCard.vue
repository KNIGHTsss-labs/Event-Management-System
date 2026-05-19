<script setup lang="ts">
// 1. นำเข้าไทป์ AppEvent ที่เราตั้งไว้
import type { AppEvent } from '~/types/event'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
  <Card>
    <CardHeader>
      <div class="flex justify-between items-start gap-2">
        <CardTitle class="text-base">{{ event.name }}</CardTitle>
        <Badge v-if="isFull" variant="destructive">เต็มแล้ว</Badge>
        <Badge v-else variant="secondary">
          {{ event.registeredCount }}
          <span v-if="event.maxParticipants"> / {{ event.maxParticipants }}</span>
        </Badge>
      </div>
    </CardHeader>

    <CardContent class="text-sm text-muted-foreground space-y-1">
      <p>📍 {{ event.location }}</p>
      <p>🗓 {{ formatDate(event.date) }}</p>
      <p v-if="event.description">{{ event.description }}</p>
    </CardContent>

    <CardFooter class="flex justify-between items-center gap-2">
      <div class="flex items-center gap-2">
        <Button
          variant="outline" size="sm"
          :disabled="event.registeredCount === 0"
          @click="emit('update-count', -1)"
        >−</Button>
        <span class="text-sm w-16 text-center">
          {{ event.registeredCount }}
          <span v-if="event.maxParticipants" class="text-muted-foreground">
            / {{ event.maxParticipants }}
          </span>
        </span>
        <Button
          variant="outline" size="sm"
          :disabled="isFull"
          @click="emit('update-count', +1)"
        >+</Button>
      </div>

      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="emit('edit')">แก้ไข</Button>
        <Button variant="destructive" size="sm" @click="emit('delete')">ลบ</Button>
      </div>
    </CardFooter>
  </Card>
</template>