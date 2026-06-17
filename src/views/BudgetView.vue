<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-dark-base">Anggaran</h1>
        <p class="text-sm text-gray-400 mt-0.5">Kelola limit dan tagihan bulanan</p>
      </div>
      <button
        @click="activeTab === 'anggaran' ? (showFormAnggaran = true) : (showFormBill = true)"
        class="flex items-center gap-2 px-4 py-2.5 bg-dark-base text-white text-sm font-semibold rounded-xl hover:bg-dark-soft transition-colors"
      >
        <HugeiconsIcon :icon="PlusSignIcon" class="w-4 h-4" />
        Tambah
      </button>
    </div>

    <!-- Tab switcher (mobile only) -->
    <div class="flex gap-2 mb-5 sm:hidden">
      <button
        @click="activeTab = 'anggaran'"
        :class="['flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all', activeTab === 'anggaran' ? 'bg-dark-base text-white' : 'bg-white text-gray-400 border border-cream-200']"
      >
        Anggaran
      </button>
      <button
        @click="activeTab = 'tagihan'"
        :class="['flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all', activeTab === 'tagihan' ? 'bg-dark-base text-white' : 'bg-white text-gray-400 border border-cream-200']"
      >
        Tagihan
      </button>
    </div>

    <!-- Desktop: side by side | Mobile: tab based -->
    <div class="flex flex-col sm:flex-row gap-6">

      <!-- Anggaran section -->
      <div :class="['flex-1', activeTab !== 'anggaran' ? 'hidden sm:block' : '']">
        <p class="hidden sm:block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Anggaran Kategori</p>
        <!-- Anggaran cards -->
        <div class="grid grid-cols-1 gap-4">
          <div v-for="item in anggaran" :key="item.id" class="glass rounded-3xl p-5 group">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-dark-base">{{ item.kategori }}</h3>
              <div class="flex items-center gap-1.5">
                <span :class="['text-xs font-semibold px-2.5 py-1 rounded-lg', item.percentage > 80 ? 'bg-red-50 text-red-500' : item.percentage > 50 ? 'bg-kuning-pastel/20 text-dark-base' : 'bg-green-50 text-green-600']">
                  {{ item.percentage }}%
                </span>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEditAnggaran(item)" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-kuning-pastel/20 text-gray-400 hover:text-dark-base transition-colors">
                    <HugeiconsIcon :icon="PencilEdit01Icon" class="w-3.5 h-3.5" />
                  </button>
                  <button @click="confirmDeleteAnggaran(item)" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
                    <HugeiconsIcon :icon="Delete01Icon" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div class="w-full h-3 bg-cream-200 rounded-full overflow-hidden mb-2">
              <div
                class="h-full rounded-full transition-all duration-700"
                :class="item.percentage > 80 ? 'bg-red-400' : 'bg-kuning-pastel'"
                :style="{ width: Math.min(item.percentage, 100) + '%' }"
              />
            </div>
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>Terpakai: <strong class="text-dark-base">{{ formatRupiah(item.terpakai) }}</strong></span>
              <span>Limit: <strong class="text-dark-base">{{ formatRupiah(item.limit_bulanan) }}</strong></span>
            </div>
          </div>
          <EmptyState v-if="!anggaran.length" :icon="Analytics01Icon" title="Belum ada anggaran" description="Buat anggaran pertama untuk mulai melacak pengeluaran" />
        </div>
      </div>

      <!-- Tagihan section -->
      <div :class="['flex-1', activeTab !== 'tagihan' ? 'hidden sm:block' : '']">
        <p class="hidden sm:block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Jadwal Tagihan</p>
        <div class="glass rounded-3xl p-5">
          <div v-if="bills.length" class="space-y-2">
            <div
              v-for="bill in bills"
              :key="bill.id"
              class="flex items-center gap-4 p-3 rounded-2xl hover:bg-cream-200/50 transition-colors"
            >
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', bill.sudah_dibayar ? 'bg-green-500/15' : 'bg-kuning-pastel/20']">
                <HugeiconsIcon :icon="CheckmarkCircle01Icon" v-if="bill.sudah_dibayar" class="w-5 h-5 text-green-500" />
                <HugeiconsIcon :icon="Clock01Icon" v-else class="w-5 h-5 text-kuning-300" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-dark-base">{{ bill.nama }}</p>
                <p class="text-xs text-gray-400">Tgl {{ bill.tanggal_jatuh_tempo }}<span v-if="bill.kategori"> &middot; {{ bill.kategori }}</span></p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-bold text-dark-base">{{ formatRupiah(bill.jumlah) }}</p>
                <button v-if="!bill.sudah_dibayar" @click="togglePaid(bill)" class="text-[10px] text-kuning-300 font-semibold hover:underline">Tandai dibayar</button>
                <span v-else class="text-[10px] text-green-500 font-semibold">Lunas</span>
              </div>
            </div>
          </div>
          <EmptyState v-else :icon="Notification01Icon" title="Belum ada tagihan" description="Tambahkan tagihan rutin untuk pengingat otomatis" />
        </div>
      </div>

    </div>

    <!-- Modal Anggaran (Tambah / Edit) -->
    <Transition name="fade">
      <div v-if="showFormAnggaran" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeFormAnggaran">
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-dark-base">{{ editingAnggaran ? 'Edit Anggaran' : 'Tambah Anggaran' }}</h3>
            <button type="button" @click="closeFormAnggaran" class="w-8 h-8 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-400 hover:text-gray-600 transition-colors">
              <HugeiconsIcon :icon="Cancel01Icon" class="w-4 h-4" />
            </button>
          </div>
          <form @submit.prevent="handleAddAnggaran" class="space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Kategori</label>
              <BaseSelect v-model="newAnggaran.kategori" :options="categories" placeholder="Pilih kategori" :disabled="!!editingAnggaran" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Limit Bulanan (Rp)</label>
              <input v-model.number="newAnggaran.limit_bulanan" type="number" required min="1" class="input-field" placeholder="1000000" />
            </div>
            <button type="submit" :disabled="submitting" class="w-full py-3 bg-dark-base text-white font-semibold rounded-xl hover:bg-dark-soft transition-colors disabled:opacity-50">
              {{ submitting ? 'Menyimpan...' : editingAnggaran ? 'Simpan Perubahan' : 'Simpan Anggaran' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal Konfirmasi Hapus Anggaran -->
    <Transition name="fade">
      <div v-if="deletingAnggaran" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="deletingAnggaran = null">
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
          <button type="button" @click="deletingAnggaran = null" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-400 transition-colors">
            <XMarkIcon class="w-4 h-4" />
          </button>
          <div class="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon :icon="Delete01Icon" class="w-6 h-6 text-red-500" />
          </div>
          <h3 class="text-base font-bold text-dark-base mb-1">Hapus Anggaran?</h3>
          <p class="text-sm text-gray-400 mb-5">{{ deletingAnggaran.kategori }} &middot; Limit {{ formatRupiah(deletingAnggaran.limit_bulanan) }}</p>
          <div class="flex gap-3">
            <button @click="deletingAnggaran = null" class="flex-1 py-2.5 rounded-xl text-sm font-medium bg-cream-100 text-gray-500 hover:bg-cream-200 transition-colors">Batal</button>
            <button @click="handleDeleteAnggaran" :disabled="submitting" class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50">
              {{ submitting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Tagihan -->
    <Transition name="fade">
      <div v-if="showFormBill" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showFormBill = false">
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-dark-base">Tambah Tagihan</h3>
            <button type="button" @click="showFormBill = false" class="w-8 h-8 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-400 hover:text-gray-600 transition-colors">
              <HugeiconsIcon :icon="Cancel01Icon" class="w-4 h-4" />
            </button>
          </div>
          <form @submit.prevent="handleAddBill" class="space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Nama Tagihan</label>
              <input v-model="newBill.nama" type="text" required class="input-field" placeholder="Listrik, Internet, dll" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Jumlah (Rp)</label>
              <input v-model.number="newBill.jumlah" type="number" required min="1" class="input-field" placeholder="350000" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Tanggal Jatuh Tempo</label>
              <input v-model.number="newBill.tanggal_jatuh_tempo" type="number" required min="1" max="31" class="input-field" placeholder="1-31" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Kategori (opsional)</label>
              <input v-model="newBill.kategori" class="input-field" placeholder="Utilitas, Langganan, dll" />
            </div>
            <button type="submit" :disabled="submitting" class="w-full py-3 bg-dark-base text-white font-semibold rounded-xl hover:bg-dark-soft transition-colors disabled:opacity-50">
              {{ submitting ? 'Menyimpan...' : 'Simpan Tagihan' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useFinance } from '@/composables/useFinance'
import { formatRupiah } from '@/utils/format'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  PlusSignIcon,
  Analytics01Icon,
  Cancel01Icon,
  Notification01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  PencilEdit01Icon,
  Delete01Icon
} from '@hugeicons/core-free-icons'
import { supabase } from '@/composables/useSupabase'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const { user } = useAuth()
const finance = useFinance()

const activeTab = ref('anggaran')
const anggaran = ref([])
const bills = ref([])
const showFormAnggaran = ref(false)
const showFormBill = ref(false)
const submitting = ref(false)
const editingAnggaran = ref(null)
const deletingAnggaran = ref(null)

const categories = ['Makanan', 'Transportasi', 'Hiburan', 'Belanja', 'Tagihan', 'Kesehatan', 'Pendidikan', 'Investasi', 'Lainnya']

const newAnggaran = ref({ kategori: '', limit_bulanan: null })
const newBill = ref({ nama: '', jumlah: null, tanggal_jatuh_tempo: null, kategori: '' })

async function loadData() {
  if (!user.value) return
  const [anggaranData, billsData] = await Promise.all([
    finance.fetchAnggaran(user.value.id),
    finance.fetchBills(user.value.id)
  ])
  anggaran.value = (anggaranData || []).map(a => ({
    ...a,
    percentage: a.limit_bulanan > 0 ? Math.round((Number(a.terpakai) / Number(a.limit_bulanan)) * 100) : 0
  }))
  bills.value = billsData || []
}

onMounted(loadData)

function openEditAnggaran(item) {
  editingAnggaran.value = item
  newAnggaran.value = { kategori: item.kategori, limit_bulanan: item.limit_bulanan }
  showFormAnggaran.value = true
}

function closeFormAnggaran() {
  showFormAnggaran.value = false
  editingAnggaran.value = null
  newAnggaran.value = { kategori: '', limit_bulanan: null }
}

function confirmDeleteAnggaran(item) {
  deletingAnggaran.value = item
}

async function handleAddAnggaran() {
  if (!newAnggaran.value.kategori) {
    alert('Silakan pilih kategori terlebih dahulu')
    return
  }
  submitting.value = true
  try {
    await finance.upsertAnggaran({ user_id: user.value.id, ...newAnggaran.value })
    closeFormAnggaran()
    await loadData()
  } catch (err) {
    alert('Gagal menyimpan: ' + err.message)
  } finally {
    submitting.value = false
  }
}

async function handleDeleteAnggaran() {
  if (!deletingAnggaran.value) return
  submitting.value = true
  try {
    await finance.deleteAnggaran(deletingAnggaran.value.id)
    deletingAnggaran.value = null
    await loadData()
  } catch (err) {
    alert('Gagal menghapus: ' + err.message)
  } finally {
    submitting.value = false
  }
}

async function handleAddBill() {
  submitting.value = true
  try {
    await finance.addBill({ user_id: user.value.id, ...newBill.value })
    showFormBill.value = false
    newBill.value = { nama: '', jumlah: null, tanggal_jatuh_tempo: null, kategori: '' }
    await loadData()
  } catch (err) {
    alert('Gagal menyimpan: ' + err.message)
  } finally {
    submitting.value = false
  }
}

async function togglePaid(bill) {
  const { error } = await supabase.from('bills').update({ sudah_dibayar: !bill.sudah_dibayar }).eq('id', bill.id)
  if (!error) await loadData()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
