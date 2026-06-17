<template>
  <div class="card-dark rounded-3xl p-5 sm:p-6 h-full flex flex-col">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-sm font-bold text-white">Transaksi Terakhir</h3>
      <span class="text-[10px] font-medium text-gray-400 bg-dark-light/50 px-2.5 py-1 rounded-lg">Hari Ini</span>
    </div>

    <div class="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin min-h-0">
      <div
        v-for="txn in transaksi"
        :key="txn.id"
        class="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-dark-light/30 transition-colors group"
      >
        <div
          :class="[
            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
            txn.tipe === 'income' ? 'bg-green-500/15' : 'bg-red-500/15'
          ]"
        >
          <HugeiconsIcon :icon="AnalyticsUpIcon" v-if="txn.tipe === 'income'" class="w-5 h-5 text-green-500" />
        <HugeiconsIcon :icon="AnalyticsDownIcon" v-else class="w-5 h-5 text-red-500" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white/90 truncate">{{ txn.kategori }}</p>
          <p class="text-xs text-gray-500 truncate">{{ txn.catatan || txn.tanggal }}</p>
        </div>
        <div class="text-right shrink-0">
          <p
            :class="[
              'text-sm font-bold',
              txn.tipe === 'income' ? 'text-green-400' : 'text-red-400'
            ]"
          >
            {{ txn.tipe === 'income' ? '+' : '-' }}{{ formatRupiah(txn.jumlah) }}
          </p>
        </div>
      </div>

      <div v-if="!transaksi.length" class="py-8 text-center">
        <p class="text-xs text-gray-500">Belum ada transaksi hari ini</p>
      </div>
    </div>

    <div class="mt-5 pt-4 border-t border-dark-light/20">
      <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-3">Pos Tabungan</p>
      <div v-for="goal in goals" :key="goal.id" class="mb-3 last:mb-0">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-medium text-white/80">{{ goal.nama_target }}</span>
          <span class="text-[10px] text-gray-400 font-medium">
            {{ goalPercentage(goal) }}%
          </span>
        </div>
        <div class="w-full h-1.5 bg-dark-light rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :style="{ width: Math.min(goalPercentage(goal), 100) + '%' }"
            :class="goalBarColor(goal.nama_target)"
          />
        </div>
      </div>
      <div v-if="!goals.length" class="py-3 text-center">
        <p class="text-xs text-gray-500">Belum ada target tabungan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatRupiah } from '@/utils/format'
import { HugeiconsIcon } from '@hugeicons/vue'
import { AnalyticsUpIcon, AnalyticsDownIcon } from '@hugeicons/core-free-icons'

defineProps({
  transaksi: { type: Array, default: () => [] },
  goals: { type: Array, default: () => [] }
})

function goalPercentage(goal) {
  if (!goal.target_dana || goal.target_dana === 0) return 0
  return Math.round((Number(goal.dana_terkumpul) / Number(goal.target_dana)) * 100)
}

function goalBarColor(name) {
  const map = {
    'Investasi': 'bg-kuning-pastel',
    'Dana Darurat': 'bg-gray-400',
    'Liburan': 'bg-kuning-200'
  }
  return map[name] || 'bg-kuning-pastel/60'
}
</script>
