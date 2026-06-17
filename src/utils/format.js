export function formatRupiah(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Rp 0'
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount))
}

export function getBulanTahun(date = new Date()) {
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

export function getMonthRange(bulan, tahun) {
  const start = `${tahun}-${String(bulan).padStart(2, '0')}-01`
  const end = `${tahun}-${String(bulan).padStart(2, '0')}-${getDaysInMonth(tahun, bulan)}`
  return { start, end }
}
