<template>
  <div class="glass rounded-3xl p-5 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-sm font-bold text-dark-base">Fluktuasi Pengeluaran</h3>
        <p class="text-xs text-gray-400 mt-0.5">Senin - Minggu</p>
      </div>
    </div>
    <div class="h-[180px]">
      <Bar
        v-if="hasData"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="h-full flex items-center justify-center">
        <p class="text-xs text-gray-400">Belum ada data pengeluaran minggu ini</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  weeklyData: { type: Array, default: () => [] }
})

const hasData = computed(() => props.weeklyData.some(d => d.total > 0))

const chartData = computed(() => ({
  labels: props.weeklyData.map(d => d.day),
  datasets: [
    {
      label: 'Pengeluaran',
      data: props.weeklyData.map(d => d.total),
      backgroundColor: '#FFD254',
      hoverBackgroundColor: '#1E1E1E',
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 32
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1E1E1E',
      titleFont: { family: 'Inter', size: 12, weight: '600' },
      bodyFont: { family: 'Inter', size: 12 },
      padding: 12,
      cornerRadius: 12,
      displayColors: false,
      callbacks: {
        label: (ctx) => formatTooltip(ctx.raw)
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#9CA3AF'
      }
    },
    y: {
      grid: { color: '#F3EFE0', drawBorder: false },
      border: { display: false },
      ticks: {
        font: { family: 'Inter', size: 10 },
        color: '#9CA3AF',
        callback: (value) => {
          if (value >= 1000000) return (value / 1000000).toFixed(1) + 'jt'
          if (value >= 1000) return (value / 1000).toFixed(0) + 'rb'
          return value
        }
      }
    }
  }
}

function formatTooltip(value) {
  return 'Rp ' + Number(value).toLocaleString('id-ID')
}
</script>
