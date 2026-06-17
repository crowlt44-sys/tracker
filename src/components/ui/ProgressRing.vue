<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg class="-rotate-90" :width="size" :height="size" viewBox="0 0 160 160">
      <circle
        cx="80" cy="80" :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
      />
      <circle
        cx="80" cy="80" :r="radius"
        fill="none"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        class="transition-all duration-1000 ease-out"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: { type: Number, default: 0 },
  size: { type: Number, default: 160 },
  strokeWidth: { type: Number, default: 10 },
  trackColor: { type: String, default: '#F3EFE0' },
  progressColor: { type: String, default: '#FFD254' }
})

const radius = 70
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => {
  return circumference - (Math.min(Math.max(props.percentage, 0), 100) / 100) * circumference
})
</script>
