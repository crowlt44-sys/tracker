<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-dark-base">Laporan</h1>
        <p class="text-sm text-gray-400 mt-0.5">Ringkasan keuangan Anda</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="exportCSV"
          class="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/60 text-dark-base text-xs font-bold rounded-xl hover:bg-white transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
        >
          <HugeiconsIcon :icon="Download01Icon" class="w-4 h-4" />
          CSV
        </button>
        <button
          @click="exportPDF"
          class="flex items-center gap-2 px-4 py-2 bg-dark-base text-white text-xs font-bold rounded-xl hover:bg-dark-soft transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
        >
          <HugeiconsIcon :icon="Download01Icon" class="w-4 h-4" />
          PDF
        </button>
      </div>
    </div>

    <!-- Tab -->
    <div class="flex p-1 mb-6 bg-cream-100/50 backdrop-blur-xl border border-cream-200/50 rounded-2xl">
      <button
        @click="activeTab = 'minggu'"
        :class="['flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300', activeTab === 'minggu' ? 'bg-white text-dark-base shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'text-gray-400 hover:text-gray-600']"
      >
        Minggu Ini
      </button>
      <button
        @click="activeTab = 'bulan'; loadBulan()"
        :class="['flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300', activeTab === 'bulan' ? 'bg-white text-dark-base shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'text-gray-400 hover:text-gray-600']"
      >
        Per Bulan
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-7 h-7 border-[3px] border-kuning-pastel border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else>
      <!-- === TAB MINGGU === -->
      <template v-if="activeTab === 'minggu'">
        <!-- Summary -->
        <div class="grid grid-cols-2 gap-3 mb-5">
          <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-[24px] p-4 text-center">
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pemasukan</p>
            <p class="text-sm sm:text-base font-extrabold text-green-500 mt-1">{{ formatRupiah(weekSummary.income) }}</p>
          </div>
          <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-[24px] p-4 text-center">
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pengeluaran</p>
            <p class="text-sm sm:text-base font-extrabold text-red-500 mt-1">{{ formatRupiah(weekSummary.expense) }}</p>
          </div>
          <div class="col-span-2 relative bg-gradient-to-br from-gray-900 to-black rounded-[24px] p-5 text-center overflow-hidden border border-white/10 shadow-lg group">
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-kuning-pastel/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <div class="relative z-10">
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Selisih Bersih</p>
              <p :class="['text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight', weekSummary.selisih >= 0 ? 'text-white' : 'text-red-400']">
                {{ formatRupiah(weekSummary.selisih) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-5 sm:p-6 mb-5">
          <h3 class="text-xs font-bold text-dark-base uppercase tracking-widest mb-4">Grafik Pengeluaran Harian</h3>
          <div class="h-[180px]">
            <Bar v-if="hasWeeklyData" :data="weeklyChartData" :options="chartOptions" />
            <div v-else class="h-full flex flex-col items-center justify-center gap-2">
              <p class="text-xs text-gray-400">Belum ada pengeluaran minggu ini</p>
            </div>
          </div>
        </div>

        <!-- Transaction list -->
        <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-5 sm:p-6">
          <h3 class="text-xs font-bold text-dark-base uppercase tracking-widest mb-4">Transaksi Minggu Ini</h3>
          <div v-if="weekTransaksi.length" class="space-y-1">
            <div
              v-for="txn in weekTransaksi"
              :key="txn.id"
              class="flex items-center gap-4 py-4 sm:py-5 border-b border-cream-200/60 last:border-0 group"
            >
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center shrink-0', txn.tipe === 'income' ? 'bg-green-500/10' : 'bg-red-500/10']">
                <HugeiconsIcon :icon="AnalyticsUpIcon" v-if="txn.tipe === 'income'" class="w-5 h-5 text-green-500" />
                <HugeiconsIcon :icon="AnalyticsDownIcon" v-else class="w-5 h-5 text-red-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-dark-base truncate">{{ txn.kategori }}</p>
                <p class="text-xs text-gray-400 mt-0.5 truncate">
                  <span v-if="txn.catatan">{{ txn.catatan }} &bull; </span>
                  <span>{{ txn.tanggal }}</span>
                </p>
              </div>
              <p class="text-xs font-semibold text-gray-500 shrink-0">
                {{ txn.tipe === 'income' ? '+' : '-' }}{{ formatRupiah(txn.jumlah) }}
              </p>
            </div>
          </div>
          <p v-else class="text-xs text-gray-400 text-center py-8">Belum ada transaksi minggu ini</p>
        </div>
      </template>

      <!-- === TAB BULAN === -->
      <template v-else>
        <!-- Month nav -->
        <div class="flex items-center justify-between mb-5 bg-white border border-cream-200 rounded-2xl px-4 py-3">
          <button @click="changeMonth(-1)" class="p-1.5 rounded-xl hover:bg-cream-100 transition-colors">
            <HugeiconsIcon :icon="ArrowLeft01Icon" class="w-4 h-4 text-gray-400" />
          </button>
          <span class="text-sm font-bold text-dark-base">{{ bulanTahunLabel }}</span>
          <button @click="changeMonth(1)" class="p-1.5 rounded-xl hover:bg-cream-100 transition-colors">
            <HugeiconsIcon :icon="ArrowRight01Icon" class="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <!-- Summary -->
        <div class="grid grid-cols-2 gap-3 mb-5">
          <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-[24px] p-4 text-center">
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pemasukan</p>
            <p class="text-sm sm:text-base font-extrabold text-green-500 mt-1">{{ formatRupiah(monthSummary.income) }}</p>
          </div>
          <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-[24px] p-4 text-center">
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pengeluaran</p>
            <p class="text-sm sm:text-base font-extrabold text-red-500 mt-1">{{ formatRupiah(monthSummary.expense) }}</p>
          </div>
          <div class="col-span-2 relative bg-gradient-to-br from-gray-900 to-black rounded-[24px] p-5 text-center overflow-hidden border border-white/10 shadow-lg group">
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-kuning-pastel/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <div class="relative z-10">
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Selisih Bersih</p>
              <p :class="['text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight', monthSummary.selisih >= 0 ? 'text-white' : 'text-red-400']">
                {{ formatRupiah(monthSummary.selisih) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Chart Bulan -->
        <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-5 sm:p-6 mb-5" v-if="kategoriData.length">
          <h3 class="text-xs font-bold text-dark-base uppercase tracking-widest mb-4">Grafik Kategori Pengeluaran</h3>
          <div class="h-[220px] flex justify-center">
            <Doughnut :data="monthlyChartData" :options="monthlyChartOptions" />
          </div>
        </div>

        <!-- Per kategori -->
        <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-5 sm:p-6 mb-5" v-if="kategoriData.length">
          <h3 class="text-xs font-bold text-dark-base uppercase tracking-widest mb-4">Detail per Kategori</h3>
          <div class="space-y-3">
            <div v-for="k in kategoriData" :key="k.kategori">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-gray-600">{{ k.kategori }}</span>
                <span class="text-xs font-bold text-dark-base">{{ formatRupiah(k.total) }}</span>
              </div>
              <div class="w-full h-2 bg-cream-200/50 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-kuning-pastel to-[#FBBF24] rounded-full" :style="{ width: k.pct + '%' }" />
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction list -->
        <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-5 sm:p-6">
          <h3 class="text-xs font-bold text-dark-base uppercase tracking-widest mb-4">Semua Transaksi</h3>
          <div v-if="monthTransaksi.length" class="space-y-1">
            <div
              v-for="txn in monthTransaksi"
              :key="txn.id"
              class="flex items-center gap-4 py-4 sm:py-5 border-b border-cream-200/60 last:border-0 group"
            >
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center shrink-0', txn.tipe === 'income' ? 'bg-green-500/10' : 'bg-red-500/10']">
                <HugeiconsIcon :icon="AnalyticsUpIcon" v-if="txn.tipe === 'income'" class="w-5 h-5 text-green-500" />
                <HugeiconsIcon :icon="AnalyticsDownIcon" v-else class="w-5 h-5 text-red-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-dark-base truncate">{{ txn.kategori }}</p>
                <p class="text-xs text-gray-400 mt-0.5 truncate">
                  <span v-if="txn.catatan">{{ txn.catatan }} &bull; </span>
                  <span>{{ txn.tanggal }}</span>
                </p>
              </div>
              <p class="text-xs font-semibold text-gray-500 shrink-0">
                {{ txn.tipe === 'income' ? '+' : '-' }}{{ formatRupiah(txn.jumlah) }}
              </p>
            </div>
          </div>
          <p v-else class="text-xs text-gray-400 text-center py-8">Belum ada transaksi bulan ini</p>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, ArcElement } from 'chart.js'
import { useAuth } from '@/composables/useAuth'
import { useFinance } from '@/composables/useFinance'
import { formatRupiah, getBulanTahun } from '@/utils/format'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Download01Icon,
  AnalyticsUpIcon,
  AnalyticsDownIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ArcElement)

const { user } = useAuth()
const finance = useFinance()

const loading = ref(false)
const activeTab = ref('minggu')
const weeklyData = ref([])
const weekTransaksi = ref([])
const monthTransaksi = ref([])
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())

// ─── WEEKLY ───────────────────────────────────────────────
const hasWeeklyData = computed(() => weeklyData.value.some(d => d.total > 0))

const weekSummary = computed(() => {
  const income = weekTransaksi.value.filter(t => t.tipe === 'income').reduce((s, t) => s + Number(t.jumlah), 0)
  const expense = weekTransaksi.value.filter(t => t.tipe === 'expense').reduce((s, t) => s + Number(t.jumlah), 0)
  return { income, expense, selisih: income - expense }
})

const weeklyChartData = computed(() => ({
  labels: weeklyData.value.map(d => d.day),
  datasets: [{
    data: weeklyData.value.map(d => d.total),
    backgroundColor: weeklyData.value.map(d => d.total > 0 ? '#FFD254' : '#F3EFE0'),
    hoverBackgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderSkipped: false,
    maxBarThickness: 36
  }]
}))

// ─── MONTHLY ──────────────────────────────────────────────
const bulanTahunLabel = computed(() => getBulanTahun(new Date(selectedYear.value, selectedMonth.value - 1)))

const monthSummary = computed(() => {
  const income = monthTransaksi.value.filter(t => t.tipe === 'income').reduce((s, t) => s + Number(t.jumlah), 0)
  const expense = monthTransaksi.value.filter(t => t.tipe === 'expense').reduce((s, t) => s + Number(t.jumlah), 0)
  return { income, expense, selisih: income - expense }
})

const kategoriData = computed(() => {
  const map = {}
  monthTransaksi.value.filter(t => t.tipe === 'expense').forEach(t => {
    map[t.kategori] = (map[t.kategori] || 0) + Number(t.jumlah)
  })
  const max = Math.max(...Object.values(map), 1)
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([kategori, total]) => ({ kategori, total, pct: Math.round((total / max) * 100) }))
})

const monthlyChartData = computed(() => {
  const labels = kategoriData.value.map(k => k.kategori)
  const data = kategoriData.value.map(k => k.total)
  
  const backgroundColors = [
    '#FFD254', '#4ADE80', '#F87171', '#60A5FA', '#A78BFA', '#F472B6', '#34D399', '#FBBF24', '#9CA3AF', '#D1D5DB'
  ]

  return {
    labels,
    datasets: [{
      data,
      backgroundColor: backgroundColors.slice(0, data.length),
      borderWidth: 0,
      hoverOffset: 4
    }]
  }
})

const monthlyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1E1E1E',
      bodyFont: { family: 'Inter', size: 12, weight: '600' },
      padding: 10,
      cornerRadius: 10,
      displayColors: true,
      callbacks: { label: ctx => ' Rp ' + Number(ctx.raw).toLocaleString('id-ID') }
    }
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1E1E1E',
      bodyFont: { family: 'Inter', size: 12, weight: '600' },
      padding: 10,
      cornerRadius: 10,
      displayColors: false,
      callbacks: { label: ctx => 'Rp ' + Number(ctx.raw).toLocaleString('id-ID') }
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 }, color: '#9CA3AF' } },
    y: {
      grid: { color: '#F3EFE0' },
      border: { display: false },
      ticks: {
        font: { family: 'Inter', size: 10 }, color: '#9CA3AF',
        callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'jt' : v >= 1000 ? (v/1000).toFixed(0)+'rb' : v
      }
    }
  }
}

async function loadWeek() {
  if (!user.value) return
  loading.value = true
  try {
    const today = new Date()
    const dow = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const start = monday.toISOString().split('T')[0]
    const end = sunday.toISOString().split('T')[0]

    const [weekly, txns] = await Promise.all([
      finance.getWeeklySpending(user.value.id),
      finance.fetchTransaksiRange(user.value.id, start, end)
    ])
    weeklyData.value = weekly
    weekTransaksi.value = txns || []
  } finally {
    loading.value = false
  }
}

async function loadBulan() {
  if (!user.value) return
  loading.value = true
  try {
    const txns = await finance.fetchTransaksi(user.value.id, {
      bulan: selectedMonth.value,
      tahun: selectedYear.value,
      limit: 200
    })
    monthTransaksi.value = txns || []
  } finally {
    loading.value = false
  }
}

function changeMonth(delta) {
  selectedMonth.value += delta
  if (selectedMonth.value > 12) { selectedMonth.value = 1; selectedYear.value++ }
  else if (selectedMonth.value < 1) { selectedMonth.value = 12; selectedYear.value-- }
  loadBulan()
}

function exportCSV() {
  const data = activeTab.value === 'minggu' ? weekTransaksi.value : monthTransaksi.value
  if (!data.length) return alert('Tidak ada data untuk diekspor')

  const header = ['Tanggal', 'Tipe', 'Kategori', 'Jumlah', 'Catatan']
  const rows = data.map(t => [
    t.tanggal,
    t.tipe === 'income' ? 'Pemasukan' : 'Pengeluaran',
    t.kategori,
    t.jumlah,
    t.catatan || ''
  ])

  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `laporan-${activeTab.value === 'minggu' ? 'minggu' : bulanTahunLabel.value.replace(' ', '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

async function exportPDF() {
  const data = activeTab.value === 'minggu' ? weekTransaksi.value : monthTransaksi.value
  if (!data.length) return alert('Tidak ada data untuk diekspor')

  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const label = activeTab.value === 'minggu' ? 'Minggu Ini' : bulanTahunLabel.value
  const summary = activeTab.value === 'minggu' ? weekSummary.value : monthSummary.value

  // Header
  doc.setFillColor(30, 30, 30)
  doc.rect(0, 0, 210, 28, 'F')
  doc.setTextColor(255, 210, 84)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('TRACKER', 14, 12)
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Laporan Keuangan', 14, 19)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text(label, 196, 15, { align: 'right' })
  doc.setFontSize(8)
  doc.text('Dicetak: ' + new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }), 196, 22, { align: 'right' })

  // Summary boxes
  const boxes = [
    { label: 'Pemasukan', value: formatRupiah(summary.income), color: [220, 252, 231] },
    { label: 'Pengeluaran', value: formatRupiah(summary.expense), color: [254, 226, 226] },
    { label: 'Selisih', value: formatRupiah(summary.selisih), color: [254, 249, 195] }
  ]
  boxes.forEach((b, i) => {
    const x = 14 + i * 62
    doc.setFillColor(...b.color)
    doc.roundedRect(x, 34, 58, 18, 3, 3, 'F')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(b.label.toUpperCase(), x + 5, 41)
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(b.value, x + 5, 48)
  })

  // Kategori breakdown (bulan only)
  let startY = 60
  if (activeTab.value === 'bulan' && kategoriData.value.length) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.text('Pengeluaran per Kategori', 14, startY)
    startY += 4

    autoTable(doc, {
      startY,
      head: [['Kategori', 'Total']],
      body: kategoriData.value.map(k => [k.kategori, formatRupiah(k.total)]),
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [245, 243, 235], textColor: [100, 100, 100], fontStyle: 'bold', fontSize: 8 },
      columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
      margin: { left: 14, right: 14 }
    })
    startY = doc.lastAutoTable.finalY + 8
  }

  // Transactions table
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text('Daftar Transaksi', 14, startY)
  startY += 4

  autoTable(doc, {
    startY,
    head: [['Tanggal', 'Tipe', 'Kategori', 'Catatan', 'Jumlah']],
    body: data.map(t => [
      t.tanggal,
      t.tipe === 'income' ? 'Masuk' : 'Keluar',
      t.kategori,
      t.catatan || '-',
      (t.tipe === 'income' ? '+' : '-') + formatRupiah(t.jumlah)
    ]),
    theme: 'striped',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [249, 246, 238] },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 16 },
      4: { halign: 'right', fontStyle: 'bold' }
    },
    didDrawCell: (d) => {
      if (d.section === 'body' && d.column.index === 4) {
        const text = d.cell.text[0] || ''
        doc.setTextColor(text.startsWith('+') ? 22 : 239, text.startsWith('+') ? 163 : 68, text.startsWith('+') ? 74 : 68)
      }
    },
    margin: { left: 14, right: 14 }
  })

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(`Halaman ${i} dari ${pageCount}`, 196, 290, { align: 'right' })
    doc.text('Tracker — Aplikasi Keuangan Pribadi', 14, 290)
  }

  const filename = `laporan-${activeTab.value === 'minggu' ? 'minggu' : label.replace(/\s/g, '-')}.pdf`
  doc.save(filename)
}

onMounted(loadWeek)
</script>
