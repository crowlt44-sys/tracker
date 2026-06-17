<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">

    <!-- Header greeting -->
    <div class="mb-6 animate-fade-up delay-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-2xl">{{ greetingEmoji }}</span>
        <h1 class="text-xl font-bold text-dark-base">Dashboard</h1>
      </div>
      <p class="text-sm text-gray-400 ml-9">{{ greeting }}, <span class="font-semibold text-dark-base/70">{{ profile?.nama_lengkap || 'Pengguna' }}</span></p>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-4">
      <div class="grid grid-cols-3 gap-3">
        <div v-for="i in 3" :key="i" class="shimmer rounded-3xl h-20" />
      </div>
      <div class="shimmer rounded-3xl h-52" />
      <div class="shimmer rounded-3xl h-64" />
    </div>

    <template v-else>
      <!-- Summary cards -->
      <div class="grid grid-cols-3 gap-3 mb-5">
        <!-- Pemasukan -->
        <div
          class="stat-card animate-fade-up delay-100 group"
          @mouseenter="tiltCard($event)"
          @mouseleave="resetTilt($event)"
        >
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-5 h-5 rounded-lg bg-green-500/20 flex items-center justify-center">
              <ArrowTrendingUpIcon class="w-3 h-3 text-green-400" />
            </div>
            <p class="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Masuk</p>
          </div>
          <p class="text-base font-extrabold text-green-400 truncate animate-count-up delay-300">
            {{ formatRupiah(totalPemasukan) }}
          </p>
          <div class="mt-2 h-0.5 rounded-full bg-green-500/20 overflow-hidden">
            <div class="h-full bg-green-400 rounded-full animate-slide-right delay-500" style="width: 70%" />
          </div>
        </div>

        <!-- Pengeluaran -->
        <div
          class="stat-card animate-fade-up delay-200 group"
          @mouseenter="tiltCard($event)"
          @mouseleave="resetTilt($event)"
        >
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-5 h-5 rounded-lg bg-red-500/20 flex items-center justify-center">
              <ArrowTrendingDownIcon class="w-3 h-3 text-red-400" />
            </div>
            <p class="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Keluar</p>
          </div>
          <p class="text-base font-extrabold text-red-400 truncate animate-count-up delay-400">
            {{ formatRupiah(totalPengeluaran) }}
          </p>
          <div class="mt-2 h-0.5 rounded-full bg-red-500/20 overflow-hidden">
            <div
              class="h-full bg-red-400 rounded-full animate-slide-right delay-600"
              :style="{ width: totalPemasukan > 0 ? Math.min(100, Math.round(totalPengeluaran / totalPemasukan * 100)) + '%' : '0%' }"
            />
          </div>
        </div>

        <!-- Selisih -->
        <div
          class="stat-card animate-fade-up delay-300 animate-pulse-glow group"
          @mouseenter="tiltCard($event)"
          @mouseleave="resetTilt($event)"
        >
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-5 h-5 rounded-lg bg-kuning-pastel/30 flex items-center justify-center">
              <SparklesIcon class="w-3 h-3 text-kuning-pastel" />
            </div>
            <p class="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Selisih</p>
          </div>
          <p :class="['text-base font-extrabold truncate animate-count-up delay-500', selisih >= 0 ? 'text-kuning-pastel' : 'text-red-400']">
            {{ formatRupiah(selisih) }}
          </p>
          <div class="mt-2 flex items-center gap-1">
            <div class="w-1.5 h-1.5 rounded-full animate-pulse" :class="selisih >= 0 ? 'bg-kuning-pastel' : 'bg-red-400'" />
            <span class="text-[9px] text-gray-500">{{ selisih >= 0 ? 'Surplus' : 'Defisit' }}</span>
          </div>
        </div>
      </div>

      <!-- Weekly bar chart -->
      <div class="glass rounded-3xl p-5 mb-4 animate-fade-up delay-400 hover-lift">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-bold text-dark-base flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-kuning-pastel/20 inline-flex items-center justify-center">
                <ChartBarIcon class="w-3.5 h-3.5 text-kuning-pastel" />
              </span>
              Pengeluaran Minggu Ini
            </h3>
            <p class="text-xs text-gray-400 mt-0.5 ml-8">Senin – Minggu</p>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold text-dark-base block">{{ formatRupiah(totalWeekly) }}</span>
            <span class="text-[10px] text-gray-400">total minggu ini</span>
          </div>
        </div>
        <div class="h-[160px]">
          <Bar v-if="hasWeeklyData" :data="weeklyChartData" :options="chartOptions" />
          <div v-else class="h-full flex flex-col items-center justify-center gap-2">
            <div class="w-10 h-10 rounded-2xl bg-cream-200/80 flex items-center justify-center animate-float">
              <ChartBarIcon class="w-5 h-5 text-gray-300" />
            </div>
            <p class="text-xs text-gray-400">Belum ada pengeluaran minggu ini</p>
          </div>
        </div>
      </div>

      <!-- Recent transactions -->
      <div class="glass rounded-3xl p-5 animate-fade-up delay-500">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-dark-base flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-dark-base/10 inline-flex items-center justify-center">
              <ClockIcon class="w-3.5 h-3.5 text-dark-base" />
            </span>
            Transaksi Terakhir
          </h3>
          <router-link
            to="/transaksi"
            class="text-xs text-gray-400 hover:text-dark-base transition-all duration-200 flex items-center gap-1 group"
          >
            Lihat semua
            <ChevronRightIcon class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </router-link>
        </div>

        <div v-if="recentTransaksi.length" class="space-y-1">
          <div
            v-for="(txn, i) in recentTransaksi"
            :key="txn.id"
            class="flex items-center gap-3 p-3 rounded-2xl hover:bg-cream-100/80 transition-all duration-200 group cursor-default animate-fade-up"
            :style="{ animationDelay: (600 + i * 60) + 'ms' }"
          >
            <div
              :class="[
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110',
                txn.tipe === 'income' ? 'bg-green-500/15' : 'bg-red-500/15'
              ]"
            >
              <ArrowTrendingUpIcon v-if="txn.tipe === 'income'" class="w-4 h-4 text-green-500" />
              <ArrowTrendingDownIcon v-else class="w-4 h-4 text-red-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-dark-base truncate">{{ txn.kategori }}</p>
              <p class="text-xs text-gray-400">{{ txn.catatan || '—' }} · {{ txn.tanggal }}</p>
            </div>
            <p
              :class="[
                'text-sm font-bold shrink-0 transition-transform duration-200 group-hover:scale-105',
                txn.tipe === 'income' ? 'text-green-600' : 'text-red-500'
              ]"
            >
              {{ txn.tipe === 'income' ? '+' : '-' }}{{ formatRupiah(txn.jumlah) }}
            </p>
          </div>
        </div>

        <div v-else class="py-10 text-center">
          <div class="w-12 h-12 rounded-2xl bg-cream-200/80 flex items-center justify-center mx-auto mb-3 animate-float">
            <ClockIcon class="w-6 h-6 text-gray-300" />
          </div>
          <p class="text-xs text-gray-400">Belum ada transaksi bulan ini</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { useAuth } from '@/composables/useAuth'
import { useFinance } from '@/composables/useFinance'
import { formatRupiah } from '@/utils/format'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  ClockIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const { user } = useAuth()
const finance = useFinance()
const totalPengeluaranGlobal = inject('totalPengeluaran')

const loading = ref(true)
const profile = ref(null)
const recentTransaksi = ref([])
const weeklyData = ref([])
const totalPemasukan = ref(0)
const totalPengeluaran = ref(0)

const selisih = computed(() => totalPemasukan.value - totalPengeluaran.value)
const totalWeekly = computed(() => weeklyData.value.reduce((s, d) => s + d.total, 0))
const hasWeeklyData = computed(() => weeklyData.value.some(d => d.total > 0))

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
})

const greetingEmoji = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return '☀️'
  if (h < 15) return '🌤️'
  if (h < 18) return '🌅'
  return '🌙'
})

// 3D tilt on card hover
function tiltCard(e) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cx = rect.width / 2
  const cy = rect.height / 2
  const rotX = ((y - cy) / cy) * -6
  const rotY = ((x - cx) / cx) * 6
  card.style.transform = `translateY(-4px) scale(1.02) rotateX(${rotX}deg) rotateY(${rotY}deg)`
  card.style.transition = 'transform 0.1s ease'
}

function resetTilt(e) {
  const card = e.currentTarget
  card.style.transform = ''
  card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
}

const weeklyChartData = computed(() => ({
  labels: weeklyData.value.map(d => d.day),
  datasets: [{
    data: weeklyData.value.map(d => d.total),
    backgroundColor: weeklyData.value.map(d => d.total > 0 ? '#FFD254' : '#F3EFE0'),
    hoverBackgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderSkipped: false,
    maxBarThickness: 36
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: 'easeOutQuart',
    delay: (ctx) => ctx.dataIndex * 80
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1E1E1E',
      titleFont: { family: 'Inter', size: 11 },
      bodyFont: { family: 'Inter', size: 12, weight: '600' },
      padding: 12,
      cornerRadius: 12,
      displayColors: false,
      callbacks: { label: ctx => 'Rp ' + Number(ctx.raw).toLocaleString('id-ID') }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Inter', size: 11 }, color: '#9CA3AF' }
    },
    y: {
      grid: { color: '#F3EFE0' },
      border: { display: false },
      ticks: {
        font: { family: 'Inter', size: 10 },
        color: '#9CA3AF',
        callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'jt' : v >= 1000 ? (v/1000).toFixed(0)+'rb' : v
      }
    }
  }
}

async function loadData() {
  if (!user.value) return
  loading.value = true
  try {
    const now = new Date()
    const bulan = now.getMonth() + 1
    const tahun = now.getFullYear()

    const [p, txns, weekly, income, expense] = await Promise.all([
      finance.fetchProfile(user.value.id),
      finance.fetchTransaksi(user.value.id, { bulan, tahun, limit: 8 }),
      finance.getWeeklySpending(user.value.id),
      finance.getTotalPemasukanBulan(user.value.id, bulan, tahun),
      finance.getTotalPengeluaranBulan(user.value.id, bulan, tahun)
    ])

    profile.value = p
    recentTransaksi.value = txns || []
    weeklyData.value = weekly
    totalPemasukan.value = income
    totalPengeluaran.value = expense
    if (totalPengeluaranGlobal) totalPengeluaranGlobal.value = expense
  } catch (err) {
    console.error('Dashboard error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
onUnmounted(() => finance.unsubscribeAll())
</script>
