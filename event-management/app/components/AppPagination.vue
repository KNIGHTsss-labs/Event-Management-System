<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
}>()
const emit = defineEmits<{
  'update:page': [page: number]
}>()

const pages = computed(() => {
  const p = props.totalPages
  if (p <= 7) return Array.from({ length: p }, (_, i) => i + 1)

  const cur = props.page
  const set = new Set([1, 2, cur-1, cur, cur+1, p-1, p].filter(n => n >= 1 && n <= p))
  const arr = [...set].sort((a, b) => a - b)

  const result: (number | '...')[] = []
  arr.forEach((n, i) => {
    if (i > 0 && n - arr[i-1] > 1) result.push('...')
    result.push(n)
  })
  return result
})
</script>

<template>
  <div class="flex items-center justify-center gap-1 mt-6">
    <button
      @click="emit('update:page', page - 1)"
      :disabled="page === 1"
      class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
    >←</button>

    <template v-for="p in pages" :key="p">
      <span v-if="p === '...'" class="px-2 text-gray-400">…</span>
      <button v-else
        @click="emit('update:page', p)"
        :class="['px-3 py-1.5 text-sm border rounded-lg',
                  p === page ? 'bg-black text-white border-black' : '']"
      >{{ p }}</button>
    </template>

    <button
      @click="emit('update:page', page + 1)"
      :disabled="page === totalPages"
      class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
    >→</button>
  </div>
</template>