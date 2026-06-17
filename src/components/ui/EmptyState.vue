<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-16 h-16 bg-cream-200 rounded-3xl flex items-center justify-center mb-4">
      <HugeiconsIcon :icon="icon" class="w-8 h-8 text-gray-400" />
    </div>
    <h3 class="text-sm font-semibold text-dark-base mb-1">{{ title }}</h3>
    <p class="text-xs text-gray-400 max-w-[200px]">{{ description }}</p>
  </div>
</template>

<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'

defineProps({
  icon: { type: [Object, Function], required: true },
  title: { type: String, default: 'Tidak ada data' },
  description: { type: String, default: '' }
})
</script>
