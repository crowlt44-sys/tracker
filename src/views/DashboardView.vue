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
      <!-- Summary cards -->
      <div class="space-y-4 mb-8">
        <!-- Hero Card (Selisih / Total Saldo) -->
        <div
          class="relative bg-dark-base rounded-[32px] p-6 sm:p-8 overflow-hidden shadow-2xl shadow-dark-base/20 animate-fade-up delay-100 group"
          @mouseenter="tiltCard($event)"
          @mouseleave="resetTilt($event)"
        >
          <!-- Decorative circles -->
          <div class="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
          <div class="absolute -left-8 -bottom-8 w-32 h-32 bg-kuning-pastel/10 rounded-full blur-xl group-hover:bg-kuning-pastel/20 transition-colors duration-500" />

          <div class="relative z-10 flex flex-col items-center text-center">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <SparklesIcon class="w-4 h-4 text-kuning-pastel" />
              </div>
              <p class="text-xs font-semibold text-white/70 uppercase tracking-widest">Total Saldo</p>
            </div>
            
            <p :class="['text-4xl sm:text-5xl font-extrabold tracking-tight animate-count-up delay-300', selisih >= 0 ? 'text-white' : 'text-red-400']">
              {{ formatRupiah(selisih) }}
            </p>
            
            <div class="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/5">
              <div class="w-2 h-2 rounded-full animate-pulse" :class="selisih >= 0 ? 'bg-kuning-pastel shadow-[0_0_8px_rgba(255,210,84,0.6)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]'" />
              <span class="text-[10px] sm:text-xs font-medium text-white/80">{{ selisih >= 0 ? 'Surplus Bulan Ini' : 'Defisit Bulan Ini' }}</span>
            </div>
          </div>
        </div>

        <!-- Grid 2 Kolom (Pemasukan & Pengeluaran) -->
        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          <!-- Pemasukan -->
          <div
            class="stat-card !p-4 sm:!p-5 animate-fade-up delay-200 group relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/50"
            @mouseenter="tiltCard($event)"
            @mouseleave="resetTilt($event)"
          >
            <div class="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/10 transition-colors duration-500" />
            <div class="flex items-center gap-2.5 mb-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <ArrowTrendingUpIcon class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <p class="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest">Pemasukan</p>
            </div>
            <p class="text-lg sm:text-2xl font-extrabold text-green-500 truncate animate-count-up delay-400">
              {{ formatRupiah(totalPemasukan) }}
            </p>
          </div>

          <!-- Pengeluaran -->
          <div
            class="stat-card !p-4 sm:!p-5 animate-fade-up delay-300 group relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/50"
            @mouseenter="tiltCard($event)"
            @mouseleave="resetTilt($event)"
          >
            <div class="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/10 transition-colors duration-500" />
            <div class="flex items-center gap-2.5 mb-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <ArrowTrendingDownIcon class="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <p class="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest">Pengeluaran</p>
            </div>
            <p class="text-lg sm:text-2xl font-extrabold text-red-500 truncate animate-count-up delay-500">
              {{ formatRupiah(totalPengeluaran) }}
            </p>
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

        <div v-if="recentTransaksi.length" class="space-y-3 mt-2">
          <div
            v-for="(txn, i) in recentTransaksi"
            :key="txn.id"
            class="flex items-center gap-3 animate-fade-up"
            :style="{ animationDelay: (600 + i * 60) + 'ms' }"
          >
            <!-- Icon -->
            <div
              :class="[
                'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0',
                txn.tipe === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
              ]"
            >
              <ArrowTrendingUpIcon v-if="txn.tipe === 'income'" class="w-5 h-5 text-green-500" />
              <ArrowTrendingDownIcon v-else class="w-5 h-5 text-red-500" />
            </div>
            
            <!-- Details -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-dark-base truncate">{{ txn.kategori }}</p>
              <p class="text-xs text-gray-400 mt-0.5 truncate">
                <span v-if="txn.catatan">{{ txn.catatan }} &bull; </span>
                <span>{{ txn.tanggal }}</span>
              </p>
            </div>
            
            <!-- Amount -->
            <p class="text-xs font-semibold text-gray-500 shrink-0">
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
