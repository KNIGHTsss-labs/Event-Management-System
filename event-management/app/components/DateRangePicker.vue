<script setup lang="ts">
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

const props = defineProps<{ from: string; to: string }>()
const emit  = defineEmits(['update:from', 'update:to'])

const range = computed({
  get: (): any  => ({
    start: props.from ? new Date(props.from) : null,
    end:   props.to   ? new Date(props.to)   : null,
  }),
  set: (val: any) => {
    emit('update:from', val.start ? new Date(val.start).toISOString() : '')
    emit('update:to',   val.end   ? new Date(val.end).toISOString()   : '')
  }
})
</script>

<template>
  <DatePicker v-model.range="range" is-range>
    <template #default="{ inputValue, inputEvents }">
      <div class="flex items-center gap-2">
        <input
          :value="inputValue.start"
          v-on="inputEvents.start"
          placeholder="From date"
          class="border rounded-lg px-3 py-2 text-sm w-32"
        />
        <span class="text-gray-400">→</span>
        <input
          :value="inputValue.end"
          v-on="inputEvents.end"
          placeholder="To date"
          class="border rounded-lg px-3 py-2 text-sm w-32"
        />
      </div>
    </template>
  </DatePicker>
</template>