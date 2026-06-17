<template>
  <div class="glass rounded-3xl p-5 sm:p-6 flex flex-col items-center">
    <h3 class="text-sm font-bold text-dark-base mb-4">Sisa Budget Aman Hari Ini</h3>
    <ProgressRing
      :percentage="safePercentage"
      :size="150"
      :stroke-width="10"
      track-color="#F3EFE0"
      progress-color="#FFD254"
    >
      <span class="text-2xl font-extrabold text-dark-base tracking-tight">{{ formatRupiah(sisaAman) }}</span>
      <span class="text-[10px] text-gray-400 mt-0.5">masih aman</span>
    </ProgressRing>
    <div class="flex items-center gap-3 mt-4 text-[11px] text-gray-400">
      <span>Budget: <strong class="text-dark-base">{{ formatRupiah(totalBudget) }}</strong></span>
      <span class="w-1 h-1 rounded-full bg-gray-300" />
      <span>Terpakai: <strong class="text-dark-base">{{ formatRupiah(totalTerpakai) }}</strong></span>
    </div>
  </div>
</template>

<script setup>
import { formatRupiah } from '@/utils/format'
import ProgressRing from '@/components/ui/ProgressRing.vue'

defineProps({
  totalBudget: { type: Number, default: 0 },
  totalTerpakai: { type: Number, default: 0 },
  sisaAman: { type: Number, default: 0 },
  safePercentage: { type: Number, default: 0 }
})
</script>
