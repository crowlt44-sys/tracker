import { ref } from 'vue'
import { supabase } from './useSupabase'

// Helper: last day of month as YYYY-MM-DD string
function lastDayOfMonth(tahun, bulan) {
  return new Date(tahun, bulan, 0).toISOString().split('T')[0]
}

export function useFinance() {
  const profile = ref(null)
  const transaksiList = ref([])
  const anggaranList = ref([])
  const goalsList = ref([])
  const billsList = ref([])
  const loading = ref(false)
  const error = ref(null)

  let realtimeChannel = null

  // ─── PROFILE ───────────────────────────────────────────

  const fetchProfile = async (userId) => {
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (err) throw err
    profile.value = data
    return data
  }

  const updateProfile = async (userId, updates) => {
    const { data, error: err } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    if (err) throw err
    profile.value = data
    return data
  }

  // ─── TRANSAKSI ─────────────────────────────────────────

  const fetchTransaksi = async (userId, { bulan, tahun, tipe, limit: limitCount = 20 } = {}) => {
    loading.value = true
    let query = supabase
      .from('transaksi')
      .select('*')
      .eq('user_id', userId)
      .order('tanggal', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limitCount)

    if (bulan && tahun) {
      const s = `${tahun}-${String(bulan).padStart(2, '0')}-01`
      const e = lastDayOfMonth(tahun, bulan)
      query = query.gte('tanggal', s).lte('tanggal', e)
    }
    if (tipe) query = query.eq('tipe', tipe)

    const { data, error: err } = await query
    if (err) throw err
    transaksiList.value = data || []
    loading.value = false
    return data
  }

  const addTransaksi = async (transaksi) => {
    const { data, error: err } = await supabase
      .from('transaksi')
      .insert(transaksi)
      .select()
      .single()
    if (err) throw err
    return data
  }

  const updateTransaksi = async (id, updates) => {
    const { data, error: err } = await supabase
      .from('transaksi')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    return data
  }

  const deleteTransaksi = async (id) => {
    const { error: err } = await supabase
      .from('transaksi')
      .delete()
      .eq('id', id)
    if (err) throw err
  }

  const fetchTransaksiRange = async (userId, start, end) => {
    const { data, error: err } = await supabase
      .from('transaksi')
      .select('*')
      .eq('user_id', userId)
      .gte('tanggal', start)
      .lte('tanggal', end)
      .order('tanggal', { ascending: false })
      .order('created_at', { ascending: false })
    if (err) throw err
    return data || []
  }

  const getTotalPengeluaranBulan = async (userId, bulan, tahun) => {
    try {
      const { data, error: err } = await supabase
        .rpc('get_total_pengeluaran_bulan', {
          p_user_id: userId,
          p_start: `${tahun}-${String(bulan).padStart(2, '0')}-01`,
          p_end: lastDayOfMonth(tahun, bulan)
        })
      if (err) throw err
      return Number(data) || 0
    } catch {
      const s = `${tahun}-${String(bulan).padStart(2, '0')}-01`
      const e = lastDayOfMonth(tahun, bulan)
      const { data } = await supabase
        .from('transaksi')
        .select('jumlah')
        .eq('user_id', userId)
        .eq('tipe', 'expense')
        .gte('tanggal', s)
        .lte('tanggal', e)
      return data?.reduce((sum, t) => sum + Number(t.jumlah), 0) || 0
    }
  }

  const getTotalPemasukanBulan = async (userId, bulan, tahun) => {
    try {
      const { data, error: err } = await supabase
        .rpc('get_total_pemasukan_bulan', {
          p_user_id: userId,
          p_start: `${tahun}-${String(bulan).padStart(2, '0')}-01`,
          p_end: lastDayOfMonth(tahun, bulan)
        })
      if (err) throw err
      return Number(data) || 0
    } catch {
      const s = `${tahun}-${String(bulan).padStart(2, '0')}-01`
      const e = lastDayOfMonth(tahun, bulan)
      const { data } = await supabase
        .from('transaksi')
        .select('jumlah')
        .eq('user_id', userId)
        .eq('tipe', 'income')
        .gte('tanggal', s)
        .lte('tanggal', e)
      return data?.reduce((sum, t) => sum + Number(t.jumlah), 0) || 0
    }
  }

  const getHighestTransaksiBulan = async (userId, bulan, tahun) => {
    const s = `${tahun}-${String(bulan).padStart(2, '0')}-01`
    const e = lastDayOfMonth(tahun, bulan)
    
    const { data: incData } = await supabase.from('transaksi')
      .select('jumlah, kategori')
      .eq('user_id', userId)
      .eq('tipe', 'income')
      .gte('tanggal', s)
      .lte('tanggal', e)
      .order('jumlah', { ascending: false })
      .limit(1)
      
    const { data: expData } = await supabase.from('transaksi')
      .select('jumlah, kategori')
      .eq('user_id', userId)
      .eq('tipe', 'expense')
      .gte('tanggal', s)
      .lte('tanggal', e)
      .order('jumlah', { ascending: false })
      .limit(1)

    return {
      highestIncome: incData?.[0] || null,
      highestExpense: expData?.[0] || null
    }
  }

  const getWeeklySpending = async (userId) => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      days.push({
        date: dateStr,
        day: dayNames[date.getDay()],
        total: 0,
        label: date.getDate().toString()
      })
    }

    const { data: txns } = await supabase
      .from('transaksi')
      .select('jumlah, tanggal')
      .eq('user_id', userId)
      .eq('tipe', 'expense')
      .gte('tanggal', days[0].date)
      .lte('tanggal', days[6].date)

    if (txns) {
      txns.forEach(t => {
        const day = days.find(d => d.date === t.tanggal)
        if (day) day.total += Number(t.jumlah)
      })
    }

    return days
  }

  // ─── ANGGARAN ──────────────────────────────────────────

  const fetchAnggaran = async (userId) => {
    const now = new Date()
    const bulan = now.getMonth() + 1
    const tahun = now.getFullYear()
    const startDate = `${tahun}-${String(bulan).padStart(2, '0')}-01`
    const endDate = lastDayOfMonth(tahun, bulan)

    const [{ data: anggaranData, error: err }, { data: txnData }] = await Promise.all([
      supabase.from('anggaran_kategori').select('*').eq('user_id', userId),
      supabase.from('transaksi').select('jumlah, kategori')
        .eq('user_id', userId).eq('tipe', 'expense')
        .gte('tanggal', startDate).lte('tanggal', endDate)
    ])

    if (err) throw err

    // Hitung terpakai bulan ini dari transaksi
    const terpakaiMap = {}
    if (txnData) {
      txnData.forEach(t => {
        terpakaiMap[t.kategori] = (terpakaiMap[t.kategori] || 0) + Number(t.jumlah)
      })
    }

    const result = (anggaranData || []).map(a => ({
      ...a,
      terpakai: terpakaiMap[a.kategori] || 0
    }))

    anggaranList.value = result
    return result
  }

  const upsertAnggaran = async (anggaran) => {
    const { data, error: err } = await supabase
      .from('anggaran_kategori')
      .upsert(anggaran, { onConflict: 'user_id, kategori' })
      .select()
      .single()
    if (err) throw err
    return data
  }

  const deleteAnggaran = async (id) => {
    const { error: err } = await supabase
      .from('anggaran_kategori')
      .delete()
      .eq('id', id)
    if (err) throw err
  }

  // ─── GOALS ─────────────────────────────────────────────

  const fetchGoals = async (userId) => {
    const { data, error: err } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    if (err) throw err
    goalsList.value = data || []
    return data
  }

  const addGoal = async (goal) => {
    const { data, error: err } = await supabase
      .from('financial_goals')
      .insert(goal)
      .select()
      .single()
    if (err) throw err
    return data
  }

  // ─── BILLS ─────────────────────────────────────────────

  const fetchBills = async (userId) => {
    const { data, error: err } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', userId)
      .order('tanggal_jatuh_tempo', { ascending: true })
    if (err) throw err
    billsList.value = data || []
    return data
  }

  const addBill = async (bill) => {
    const { data, error: err } = await supabase
      .from('bills')
      .insert(bill)
      .select()
      .single()
    if (err) throw err
    return data
  }

  const updateBill = async (id, updates) => {
    const { data, error: err } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    return data
  }

  const deleteBill = async (id) => {
    const { error: err } = await supabase
      .from('bills')
      .delete()
      .eq('id', id)
    if (err) throw err
  }

  // ─── REALTIME ──────────────────────────────────────────

  const subscribeTransaksi = (userId, callback) => {
    realtimeChannel = supabase
      .channel('transaksi-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transaksi',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (callback) callback(payload.new)
        }
      )
      .subscribe()
  }

  const unsubscribeAll = () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
    }
  }

  return {
    profile, transaksiList, anggaranList, goalsList, billsList,
    loading, error,
    fetchProfile, updateProfile,
    fetchTransaksi, addTransaksi, updateTransaksi, deleteTransaksi, fetchTransaksiRange,
    getTotalPengeluaranBulan, getTotalPemasukanBulan, getWeeklySpending, getHighestTransaksiBulan,
    fetchAnggaran, upsertAnggaran, deleteAnggaran,
    fetchGoals, addGoal,
    fetchBills, addBill, updateBill, deleteBill,
    subscribeTransaksi, unsubscribeAll
  }
}
