<script setup lang="ts">
// 1. นำเข้าไทป์ EventFilters เพื่อระบุโครงสร้างให้ตัวเลือกรองรับข้อมูลได้ถูกต้อง
import type { EventFilters } from '~/types/event'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// 2. ใช้ defineModel ในการรับและส่งค่ากลับไปหาหน้าหลัก (index.vue)
const filters = defineModel<EventFilters>({ required: true })
</script>

<template>
  <div class="flex flex-col sm:flex-row flex-wrap gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
    
    <div class="flex-1 min-w-[200px]">
      <input 
        v-model="filters.name" 
        placeholder="🔍 ค้นหาด้วยชื่อกิจกรรม..."
      />
    </div>

    <input 
      type="date" 
      v-model="filters.date"
      class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 transition cursor-pointer" 
    />

    <select 
      v-model="filters.status"
      class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 transition cursor-pointer text-gray-700"
    >
      <option value="">ทั้งหมด</option>
      <option value="upcoming">ยังไม่เริ่ม (Upcoming)</option>
      <option value="today">วันนี้ (Today)</option>
      <option value="past">จบไปแล้ว (Past)</option>
    </select>

    <select 
      v-model="filters.sortBy"
      class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 transition cursor-pointer text-gray-700"
    >
      <option value="date">เรียงตามวันที่กิจกรรม</option>
      <option value="registeredCount">เรียงตามจำนวนผู้สมัคร</option>
    </select>

    <button 
      @click="filters.order = filters.order === 'asc' ? 'desc' : 'asc'">
      <span v-if="filters.order === 'asc'" class="text-blue-600">▲ น้อยไปมาก</span>
      <span v-else class="text-red-500">▼ มากไปน้อย</span>
    </button>
    
  </div>
</template>