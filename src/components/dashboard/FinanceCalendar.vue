<template>
  <div class="glass rounded-3xl p-5 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-dark-base">Kalender Tagihan</h3>
      <div class="flex items-center gap-1">
        <button
          @click="$emit('prev-month')"
          class="p-1.5 rounded-xl hover:bg-cream-200 transition-colors"
        >
          <ChevronLeftIcon class="w-4 h-4 text-gray-400" />
        </button>
        <span class="text-xs font-semibold text-dark-base min-w-[100px] text-center select-none">
          {{ bulanTahun }}
        </span>
        <button
          @click="$emit('next-month')"
          class="p-1.5 rounded-xl hover:bg-cream-200 transition-colors"
        >
          <ChevronRightIcon class="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>

    <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
      <div
        v-for="day in days"
        :key="day.date"
        :class="[
          'flex flex-col items-center min-w-[42px] py-2.5 px-1.5 rounded-2xl transition-all',
          day.hasTagihan
            ? 'bg-kuning-pastel/20 ring-1 ring-kuning-pastel/50'
            : 'hover:bg-cream-200/50'
        ]"
      >
        <span class="text-[10px] text-gray-400 font-medium leading-none">{{ day.namaHari }}</span>
        <span
          :class="[
            'text-sm font-bold mt-1 leading-none',
            day.hasTagihan ? 'text-dark-base' : 'text-gray-500'
          ]"
        >{{ day.tanggal }}</span>
        <div
          v-if="day.hasTagihan"
          class="w-1.5 h-1.5 rounded-full bg-kuning-pastel mt-1.5"
        />
      </div>
    </div>

    <div v-if="tagihanHariIni.length" class="mt-4 p-3 bg-red-50/60 rounded-2xl border border-red-100">
      <div class="flex items-center gap-1.5 mb-2">
        <ExclamationCircleIcon class="w-4 h-4 text-red-400" />
        <span class="text-[10px] font-medium text-red-400 uppercase tracking-wider">Jatuh tempo hari ini</span>
      </div>
      <div v-for="t in tagihanHariIni" :key="t.id" class="flex items-center justify-between py-1">
        <span class="text-xs text-dark-base font-medium">{{ t.nama }}</span>
        <span class="text-xs font-bold text-red-400">{{ formatRupiah(t.jumlah) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { formatRupiah, getDaysInMonth, getBulanTahun } from '@/utils/format'

const props = defineProps({
  bills: { type: Array, default: () => [] },
  currentMonth: { type: Number, default: 1 },
  currentYear: { type: Number, default: 2024 }
})

defineEmits(['prev-month', 'next-month'])

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const now = new Date()
const isCurrentMonth = computed(() => props.currentMonth === now.getMonth() + 1 && props.currentYear === now.getFullYear())
const today = now.getDate()

const days = computed(() => {
  const totalDays = getDaysInMonth(props.currentYear, props.currentMonth)
  const billDays = new Set(
    props.bills.filter(b => !b.sudah_dibayar).map(b => b.tanggal_jatuh_tempo)
  )

  return Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1
    const date = new Date(props.currentYear, props.currentMonth - 1, day)
    return {
      date: `${props.currentYear}-${String(props.currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      tanggal: day,
      namaHari: dayNames[date.getDay()],
      hasTagihan: billDays.has(day),
      isToday: isCurrentMonth.value && day === today
    }
  })
})

const bulanTahun = computed(() => {
  const d = new Date(props.currentYear, props.currentMonth - 1)
  return getBulanTahun(d)
})

const tagihanHariIni = computed(() => {
  if (!isCurrentMonth.value) return []
  return props.bills.filter(b => b.tanggal_jatuh_tempo === today && !b.sudah_dibayar)
})
</script>
