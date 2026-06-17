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
          class="flex items-center gap-2 px-3 py-2.5 bg-white border border-cream-200 text-dark-base text-sm font-semibold rounded-xl hover:bg-cream-100 transition-colors"
        >
          <ArrowDownTrayIcon class="w-4 h-4" />
          CSV
        </button>
        <button
          @click="exportPDF"
          class="flex items-center gap-2 px-3 py-2.5 bg-dark-base text-white text-sm font-semibold rounded-xl hover:bg-dark-soft transition-colors"
        >
          <DocumentArrowDownIcon class="w-4 h-4" />
          PDF
        </button>
      </div>
    </div>

    <!-- Tab -->
    <div class="flex gap-2 mb-5">
      <button
        @click="activeTab = 'minggu'"
        :class="['flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all', activeTab === 'minggu' ? 'bg-dark-base text-white' : 'bg-white text-gray-400 border border-cream-200']"
      >
        Minggu Ini
      </button>
      <button
        @click="activeTab = 'bulan'; loadBulan()"
        :class="['flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all', activeTab === 'bulan' ? 'bg-dark-base text-white' : 'bg-white text-gray-400 border border-cream-200']"
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
        <div class="grid grid-cols-3 gap-3 mb-5">
          <div class="glass rounded-3xl p-4 text-center">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Pemasukan</p>
            <p class="text-sm font-extrabold text-green-600 mt-1">{{ formatRupiah(weekSummary.income) }}</p>
          </div>
          <div class="glass rounded-3xl p-4 text-center">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Pengeluaran</p>
            <p class="text-sm font-extrabold text-red-500 mt-1">{{ formatRupiah(weekSummary.expense) }}</p>
          </div>
          <div class="glass rounded-3xl p-4 text-center">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Selisih</p>
            <p :class="['text-sm font-extrabold mt-1', weekSummary.selisih >= 0 ? 'text-green-600' : 'text-red-500']">
              {{ formatRupiah(weekSummary.selisih) }}
            </p>
          </div>
        </div>

        <!-- Chart -->
        <div class="glass rounded-3xl p-5 mb-4">
          <h3 class="text-sm font-bold text-dark-base mb-4">Grafik Pengeluaran Harian</h3>
          <div class="h-[180px]">
            <Bar v-if="hasWeeklyData" :data="weeklyChartData" :options="chartOptions" />
            <div v-else class="h-full flex items-center justify-center">
              <p class="text-xs text-gray-400">Belum ada pengeluaran minggu ini</p>
            </div>
          </div>
        </div>

        <!-- Transaction list -->
        <div class="glass rounded-3xl p-5">
          <h3 class="text-sm font-bold text-dark-base mb-4">Transaksi Minggu Ini</h3>
          <div v-if="weekTransaksi.length" class="space-y-1">
            <div
              v-for="txn in weekTransaksi"
              :key="txn.id"
              class="flex items-center gap-3 p-3 rounded-2xl hover:bg-cream-200/50 transition-colors"
            >
              <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0', txn.tipe === 'income' ? 'bg-green-500/15' : 'bg-red-500/15']">
                <ArrowTrendingUpIcon v-if="txn.tipe === 'income'" class="w-4 h-4 text-green-500" />
                <ArrowTrendingDownIcon v-else class="w-4 h-4 text-red-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-dark-base">{{ txn.kategori }}</p>
                <p class="text-xs text-gray-400">{{ txn.catatan || '-' }} · {{ txn.tanggal }}</p>
              </div>
              <p :class="['text-sm font-bold shrink-0', txn.tipe === 'income' ? 'text-green-600' : 'text-red-500']">
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
            <ChevronLeftIcon class="w-4 h-4 text-gray-400" />
          </button>
          <span class="text-sm font-bold text-dark-base">{{ bulanTahunLabel }}</span>
          <button @click="changeMonth(1)" class="p-1.5 rounded-xl hover:bg-cream-100 transition-colors">
            <ChevronRightIcon class="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <!-- Summary -->
        <div class="grid grid-cols-3 gap-3 mb-5">
          <div class="glass rounded-3xl p-4 text-center">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Pemasukan</p>
            <p class="text-sm font-extrabold text-green-600 mt-1">{{ formatRupiah(monthSummary.income) }}</p>
          </div>
          <div class="glass rounded-3xl p-4 text-center">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Pengeluaran</p>
            <p class="text-sm font-extrabold text-red-500 mt-1">{{ formatRupiah(monthSummary.expense) }}</p>
          </div>
          <div class="glass rounded-3xl p-4 text-center">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Selisih</p>
            <p :class="['text-sm font-extrabold mt-1', monthSummary.selisih >= 0 ? 'text-green-600' : 'text-red-500']">
              {{ formatRupiah(monthSummary.selisih) }}
            </p>
          </div>
        </div>

        <!-- Per kategori -->
        <div class="glass rounded-3xl p-5 mb-4" v-if="kategoriData.length">
          <h3 class="text-sm font-bold text-dark-base mb-4">Pengeluaran per Kategori</h3>
          <div class="space-y-3">
            <div v-for="k in kategoriData" :key="k.kategori">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-gray-600">{{ k.kategori }}</span>
                <span class="text-xs font-bold text-dark-base">{{ formatRupiah(k.total) }}</span>
              </div>
              <div class="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
                <div class="h-full bg-kuning-pastel rounded-full" :style="{ width: k.pct + '%' }" />
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction list -->
        <div class="glass rounded-3xl p-5">
          <h3 class="text-sm font-bold text-dark-base mb-4">Semua Transaksi</h3>
          <div v-if="monthTransaksi.length" class="space-y-1">
            <div
              v-for="txn in monthTransaksi"
              :key="txn.id"
              class="flex items-center gap-3 p-3 rounded-2xl hover:bg-cream-200/50 transition-colors"
            >
              <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0', txn.tipe === 'income' ? 'bg-green-500/15' : 'bg-red-500/15']">
                <ArrowTrendingUpIcon v-if="txn.tipe === 'income'" class="w-4 h-4 text-green-500" />
                <ArrowTrendingDownIcon v-else class="w-4 h-4 text-red-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-dark-base">{{ txn.kategori }}</p>
                <p class="text-xs text-gray-400">{{ txn.catatan || '-' }} · {{ txn.tanggal }}</p>
              </div>
              <p :class="['text-sm font-bold shrink-0', txn.tipe === 'income' ? 'text-green-600' : 'text-red-500']">
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
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { useAuth } from '@/composables/useAuth'
import { useFinance } from '@/composables/useFinance'
import { formatRupiah, getBulanTahun } from '@/utils/format'
import {
  ArrowDownTrayIcon, DocumentArrowDownIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/vue/24/outline'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

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
