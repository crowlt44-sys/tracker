<template>
  <div class="glass rounded-3xl p-5 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-sm font-bold text-dark-base">Anggaran Minggu Ini</h3>
        <p class="text-xs text-gray-400 mt-0.5">Progress pengeluaran vs budget</p>
      </div>
      <span class="text-xs font-bold text-dark-base whitespace-nowrap">
        {{ formatRupiah(totalTerpakai) }}
        <span class="text-gray-400 font-normal">/ {{ formatRupiah(totalBudget) }}</span>
      </span>
    </div>
    <div class="space-y-3">
      <div v-for="(item, index) in budgetItems" :key="index">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium text-gray-500">{{ item.kategori }}</span>
          <span class="text-xs font-semibold text-dark-base">{{ item.percentage }}%</span>
        </div>
        <div class="w-full h-2.5 bg-cream-200 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="item.percentage > 80 ? 'bg-red-400' : 'bg-kuning-pastel'"
            :style="{ width: Math.min(item.percentage, 100) + '%' }"
          />
        </div>
      </div>
      <div v-if="!budgetItems.length" class="py-6 text-center">
        <p class="text-xs text-gray-400">Belum ada data anggaran</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatRupiah } from '@/utils/format'

defineProps({
  budgetItems: { type: Array, default: () => [] },
  totalTerpakai: { type: Number, default: 0 },
  totalBudget: { type: Number, default: 0 }
})
</script>
