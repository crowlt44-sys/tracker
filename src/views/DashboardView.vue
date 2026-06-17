<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">

    <!-- Header greeting -->
    <div class="flex items-center justify-between gap-2 mb-8 animate-fade-up delay-0 relative z-20">
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream-200 border-2 border-white shadow-sm flex items-center justify-center text-xl sm:text-2xl shrink-0">
          {{ greetingEmoji }}
        </div>
        <div class="min-w-0">
          <p class="text-[10px] sm:text-xs text-gray-500 font-medium truncate">{{ greeting }},</p>
          <h1 class="text-sm sm:text-lg font-bold text-dark-base truncate">{{ profile?.nama_lengkap || 'Pengguna' }}</h1>
        </div>
      </div>

      <!-- Filter -->
      <div class="flex items-center gap-2 shrink-0">
        <BaseSelect v-model="selectedMonthName" :options="monthNames" class="w-[120px]" />
        <BaseSelect v-model="selectedYear" :options="yearOptions" class="w-[85px] shrink-0" />
      </div>
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
      <!-- Wallet Section -->
      <div class="mb-8">
        <!-- Hero Card (Wallet Card) -->
        <div
          class="relative bg-gradient-to-br from-gray-900 via-[#1A1C23] to-black rounded-[32px] p-8 overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-up delay-100 group mb-6"
          @mouseenter="tiltCard($event)"
          @mouseleave="resetTilt($event)"
        >
          <!-- Decorative circles (Minimalist) -->
          <div class="absolute -right-24 -top-24 w-72 h-72 bg-gradient-to-br from-kuning-pastel/10 to-transparent rounded-full blur-[80px] group-hover:bg-kuning-pastel/20 transition-colors duration-1000" />
          <div class="absolute -left-24 -bottom-24 w-72 h-72 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-[80px]" />

          <!-- Elegant Watermark -->
          <div class="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 select-none pointer-events-none opacity-[0.04]">
            <span class="text-[180px] font-bold text-white tracking-tighter" style="font-family: 'Elms Sans', sans-serif; line-height: 0.8;">
              .tracker
            </span>
          </div>

          <div class="relative z-10 flex flex-col items-start w-full">
            
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-2">Total Balance</p>
            <div class="flex items-start gap-2">
              <span class="text-sm font-semibold text-kuning-pastel mt-1">IDR</span>
              <p :class="['text-4xl sm:text-5xl font-light tracking-tight animate-count-up delay-300', selisih >= 0 ? 'text-white' : 'text-red-400']" style="font-family: 'Elms Sans', sans-serif;">
                {{ formatRupiah(selisih).replace('Rp', '').trim() }}
              </p>
            </div>

            <div class="flex items-end justify-between w-full mt-10 pt-6 border-t border-white/5">
              <div class="flex-1 min-w-0 pr-4">
                <p class="text-[8px] text-gray-500 font-bold uppercase tracking-[0.25em] mb-1 truncate">Cardholder Name</p>
                <p class="text-xs text-white font-medium tracking-[0.15em] uppercase truncate w-full">{{ profile?.nama_lengkap || 'PENGGUNA' }}</p>
              </div>
              <div class="flex shrink-0">
                <span
                  class="text-lg sm:text-xl font-medium text-white tracking-widest select-none opacity-50"
                  style="font-family: 'Elms Sans', sans-serif;"
                >
                  .tracker
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Row -->
        <div class="flex items-center justify-between gap-3 sm:gap-4 animate-fade-up delay-200">
          <button @click="$router.push('/transaksi')" class="flex-1 bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white hover:-translate-y-1 transition-all group">
            <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-green-500/15 transition-all">
              <HugeiconsIcon :icon="AnalyticsUpIcon" class="w-6 h-6 text-green-500" />
            </div>
            <span class="text-xs font-bold text-dark-base">Pemasukan</span>
          </button>
          
          <button @click="$router.push('/transaksi')" class="flex-1 bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white hover:-translate-y-1 transition-all group">
            <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500/15 transition-all">
              <HugeiconsIcon :icon="AnalyticsDownIcon" class="w-6 h-6 text-red-500" />
            </div>
            <span class="text-xs font-bold text-dark-base">Pengeluaran</span>
          </button>
          
          <button @click="$router.push('/transaksi')" class="flex-1 bg-gradient-to-br from-dark-base to-black border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-xl hover:shadow-dark-base/30 hover:-translate-y-1 transition-all group">
            <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all">
              <HugeiconsIcon :icon="PlusSignIcon" class="w-6 h-6 text-white" />
            </div>
            <span class="text-xs font-bold text-white">Tambah</span>
          </button>
        </div>
      </div>

      <!-- Monthly Stats Minimalist -->
      <div class="flex items-center justify-between bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl p-4 sm:px-6 mb-4 animate-fade-up delay-300">
        <div class="flex-1">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Pemasukan</p>
          <p class="text-xs sm:text-sm font-extrabold text-green-500 mt-0.5 tracking-tight truncate" style="font-family: 'Elms Sans', sans-serif;">{{ formatRupiah(totalPemasukan) }}</p>
        </div>
        <div class="w-px h-8 bg-cream-200 mx-3 sm:mx-6 shrink-0"></div>
        <div class="flex-1 text-right">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Pengeluaran</p>
          <p class="text-xs sm:text-sm font-extrabold text-red-500 mt-0.5 tracking-tight truncate" style="font-family: 'Elms Sans', sans-serif;">{{ formatRupiah(totalPengeluaran) }}</p>
        </div>
      </div>

      <!-- Highest Transactions -->
      <div class="grid grid-cols-2 gap-3 mb-4 animate-fade-up delay-300">
        <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <HugeiconsIcon :icon="AnalyticsUpIcon" class="w-3.5 h-3.5 text-green-500" />
            </div>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">Rekor Pemasukan</p>
          </div>
          <p class="text-sm sm:text-base font-extrabold text-green-500 tracking-tight" style="font-family: 'Elms Sans', sans-serif;">{{ highestIncome ? formatRupiah(highestIncome.jumlah) : 'Rp 0' }}</p>
          <p class="text-[10px] text-gray-400 font-medium truncate mt-0.5">{{ highestIncome ? highestIncome.kategori : '-' }}</p>
        </div>
        <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
              <HugeiconsIcon :icon="AnalyticsDownIcon" class="w-3.5 h-3.5 text-red-500" />
            </div>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">Rekor Pengeluaran</p>
          </div>
          <p class="text-sm sm:text-base font-extrabold text-red-500 tracking-tight" style="font-family: 'Elms Sans', sans-serif;">{{ highestExpense ? formatRupiah(highestExpense.jumlah) : 'Rp 0' }}</p>
          <p class="text-[10px] text-gray-400 font-medium truncate mt-0.5">{{ highestExpense ? highestExpense.kategori : '-' }}</p>
        </div>
      </div>

      <!-- Weekly bar chart -->
      <div class="glass rounded-3xl p-5 mb-4 animate-fade-up delay-400 hover-lift">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-bold text-dark-base flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-kuning-pastel/20 inline-flex items-center justify-center">
                <HugeiconsIcon :icon="Analytics01Icon" class="w-3.5 h-3.5 text-kuning-pastel" />
              </span>
              Pengeluaran Minggu Ini
            </h3>
            <p class="text-xs text-gray-400 mt-0.5 ml-8">Senin – Minggu</p>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold text-dark-base block tracking-tight" style="font-family: 'Elms Sans', sans-serif;">{{ formatRupiah(totalWeekly) }}</span>
            <span class="text-[10px] text-gray-400">total minggu ini</span>
          </div>
        </div>
        <div class="h-[160px]">
          <Bar v-if="hasWeeklyData" :data="weeklyChartData" :options="chartOptions" />
          <div v-else class="h-full flex flex-col items-center justify-center gap-2">
            <div class="w-10 h-10 rounded-2xl bg-cream-200/80 flex items-center justify-center animate-float">
              <HugeiconsIcon :icon="Analytics01Icon" class="w-5 h-5 text-gray-300" />
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
              <HugeiconsIcon :icon="Clock01Icon" class="w-3.5 h-3.5 text-dark-base" />
            </span>
            Transaksi Terakhir
          </h3>
          <router-link
            to="/transaksi"
            class="text-xs text-gray-400 hover:text-dark-base transition-all duration-200 flex items-center gap-1 group"
          >
            Lihat semua
            <HugeiconsIcon :icon="ArrowRight01Icon" class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </router-link>
        </div>

        <div v-if="recentTransaksi.length" class="space-y-4 mt-4">
          <div
            v-for="(txn, i) in recentTransaksi"
            :key="txn.id"
            class="flex items-center gap-3 animate-fade-up"
            :style="{ animationDelay: (600 + i * 60) + 'ms' }"
          >
            <!-- Icon -->
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
                txn.tipe === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
              ]"
            >
              <HugeiconsIcon :icon="AnalyticsUpIcon" v-if="txn.tipe === 'income'" class="w-5 h-5 text-green-500" />
              <HugeiconsIcon :icon="AnalyticsDownIcon" v-else class="w-5 h-5 text-red-500" />
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
            <p class="text-xs font-bold text-gray-500 shrink-0 tracking-tight" style="font-family: 'Elms Sans', sans-serif;">
              {{ txn.tipe === 'income' ? '+' : '-' }}{{ formatRupiah(txn.jumlah) }}
            </p>
          </div>
        </div>

        <div v-else class="py-10 text-center">
          <div class="w-12 h-12 rounded-2xl bg-cream-200/80 flex items-center justify-center mx-auto mb-3 animate-float">
            <HugeiconsIcon :icon="Clock01Icon" class="w-6 h-6 text-gray-300" />
          </div>
          <p class="text-xs text-gray-400">Belum ada transaksi bulan ini</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { useAuth } from '@/composables/useAuth'
import { useFinance } from '@/composables/useFinance'
import { formatRupiah } from '@/utils/format'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  AnalyticsUpIcon,
  AnalyticsDownIcon,
  Analytics01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  SparklesIcon,
  PlusSignIcon
} from '@hugeicons/core-free-icons'

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
const highestIncome = ref(null)
const highestExpense = ref(null)

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const currentYear = new Date().getFullYear()
const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]

const selectedMonthName = ref(monthNames[new Date().getMonth()])
const selectedYear = ref(currentYear)

watch([selectedMonthName, selectedYear], () => {
  loadData()
})

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
    const bulan = monthNames.indexOf(selectedMonthName.value) + 1
    const tahun = selectedYear.value

    const [p, txns, weekly, income, expense, highest] = await Promise.all([
      finance.fetchProfile(user.value.id),
      finance.fetchTransaksi(user.value.id, { bulan, tahun, limit: 8 }),
      finance.getWeeklySpending(user.value.id),
      finance.getTotalPemasukanBulan(user.value.id, bulan, tahun),
      finance.getTotalPengeluaranBulan(user.value.id, bulan, tahun),
      finance.getHighestTransaksiBulan(user.value.id, bulan, tahun)
    ])

    profile.value = p
    recentTransaksi.value = txns || []
    weeklyData.value = weekly
    totalPemasukan.value = income
    totalPengeluaran.value = expense
    highestIncome.value = highest.highestIncome
    highestExpense.value = highest.highestExpense
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
