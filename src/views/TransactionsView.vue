<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6 animate-fade-up delay-0">
      <div>
        <h1 class="text-xl font-bold text-dark-base">Transaksi</h1>
        <p class="text-sm text-gray-400 mt-0.5">Riwayat pemasukan dan pengeluaran</p>
      </div>
      <button
        @click="openAdd"
        class="flex items-center gap-2 px-4 py-2.5 bg-dark-base text-white text-sm font-semibold rounded-xl hover:bg-dark-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-dark-base/20 active:translate-y-0 active:scale-95 btn-ripple"
      >
        <PlusIcon class="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
        Tambah
      </button>
    </div>

    <div class="glass rounded-3xl p-5 sm:p-6 animate-fade-up delay-100">
      <div class="flex items-center gap-3 mb-5 overflow-x-auto pb-2 scrollbar-thin">
        <button
          v-for="f in filters"
          :key="f.key"
          @click="activeFilter = f.key"
          class="pill-base whitespace-nowrap btn-ripple"
          :class="activeFilter === f.key ? 'pill-active' : 'pill-inactive'"
        >
          {{ f.label }}
        </button>
      </div>

      <TransitionGroup name="list" tag="div" class="space-y-1">
        <div
          v-for="txn in filteredTransaksi"
          :key="txn.id"
          class="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-cream-200/60 last:border-0 group"
        >
          <div
            :class="[
              'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0',
              txn.tipe === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
            ]"
          >
            <ArrowTrendingUpIcon v-if="txn.tipe === 'income'" class="w-5 h-5 text-green-500" />
            <ArrowTrendingDownIcon v-else class="w-5 h-5 text-red-500" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-dark-base truncate">{{ txn.kategori }}</p>
            <p class="text-xs text-gray-400 mt-0.5 truncate">
              <span v-if="txn.catatan">{{ txn.catatan }} &bull; </span>
              <span>{{ txn.tanggal }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <p class="text-xs font-semibold text-gray-500 shrink-0">
              {{ txn.tipe === 'income' ? '+' : '-' }}{{ formatRupiah(txn.jumlah) }}
            </p>
            <div class="flex gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 translate-x-0 sm:translate-x-2 sm:group-hover:translate-x-0">
              <button @click="openEdit(txn)" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-kuning-pastel/20 text-gray-400 hover:text-dark-base transition-all duration-150 active:scale-90 btn-ripple">
                <PencilIcon class="w-3.5 h-3.5" />
              </button>
              <button @click="confirmDelete(txn)" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all duration-150 active:scale-90 btn-ripple">
                <TrashIcon class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="!filteredTransaksi.length" class="py-10 text-center">
        <EmptyState :icon="CurrencyDollarIcon" title="Belum ada transaksi" description="Mulai catat pemasukan atau pengeluaran pertama Anda" />
      </div>
    </div>

    <!-- Modal Tambah / Edit -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeForm">
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-dark-base">{{ editingTxn ? 'Edit Transaksi' : 'Tambah Transaksi' }}</h3>
            <button type="button" @click="closeForm" class="w-8 h-8 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="flex gap-2">
              <button
                v-for="t in ['expense', 'income']"
                :key="t"
                type="button"
                @click="form.tipe = t"
                :class="['flex-1 py-2.5 rounded-xl text-sm font-medium transition-all', form.tipe === t ? (t === 'expense' ? 'bg-red-500/15 text-red-500 ring-1 ring-red-500/30' : 'bg-green-500/15 text-green-600 ring-1 ring-green-500/30') : 'bg-cream-100 text-gray-400']"
              >
                {{ t === 'expense' ? 'Pengeluaran' : 'Pemasukan' }}
              </button>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Jumlah (Rp)</label>
              <input v-model.number="form.jumlah" type="number" required min="1" class="input-field" placeholder="100000" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Kategori</label>
              <BaseSelect v-model="form.kategori" :options="categories" placeholder="Pilih kategori" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Catatan (opsional)</label>
              <input v-model="form.catatan" class="input-field" placeholder="Catatan..." />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Tanggal</label>
              <input v-model="form.tanggal" type="date" required class="input-field" />
            </div>
            <button type="submit" :disabled="submitting" class="w-full py-3 bg-dark-base text-white font-semibold rounded-xl hover:bg-dark-soft transition-colors disabled:opacity-50">
              {{ submitting ? 'Menyimpan...' : editingTxn ? 'Simpan Perubahan' : 'Simpan Transaksi' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal Konfirmasi Hapus -->
    <Transition name="fade">
      <div v-if="deletingTxn" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="deletingTxn = null">
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
          <button type="button" @click="deletingTxn = null" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon class="w-4 h-4" />
          </button>
          <div class="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrashIcon class="w-6 h-6 text-red-500" />
          </div>
          <h3 class="text-base font-bold text-dark-base mb-1">Hapus Transaksi?</h3>
          <p class="text-sm text-gray-400 mb-5">{{ deletingTxn.kategori }} &middot; {{ formatRupiah(deletingTxn.jumlah) }}</p>
          <div class="flex gap-3">
            <button @click="deletingTxn = null" class="flex-1 py-2.5 rounded-xl text-sm font-medium bg-cream-100 text-gray-500 hover:bg-cream-200 transition-colors">Batal</button>
            <button @click="handleDelete" :disabled="submitting" class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50">
              {{ submitting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useFinance } from '@/composables/useFinance'
import { goeyToast } from 'goey-toast-vue'
import { formatRupiah } from '@/utils/format'
import { PlusIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const { user } = useAuth()
const finance = useFinance()

const transaksi = ref([])
const showForm = ref(false)
const submitting = ref(false)
const activeFilter = ref('semua')
const editingTxn = ref(null)
const deletingTxn = ref(null)

const filters = [
  { key: 'semua', label: 'Semua' },
  { key: 'income', label: 'Pemasukan' },
  { key: 'expense', label: 'Pengeluaran' }
]

const categories = ['Makanan', 'Transportasi', 'Hiburan', 'Belanja', 'Tagihan', 'Kesehatan', 'Pendidikan', 'Gaji', 'Investasi', 'Tabungan', 'Lainnya']

const emptyForm = () => ({ tipe: 'expense', jumlah: null, kategori: '', catatan: '', tanggal: new Date().toISOString().split('T')[0] })
const form = ref(emptyForm())

const filteredTransaksi = computed(() => {
  if (activeFilter.value === 'semua') return transaksi.value
  return transaksi.value.filter(t => t.tipe === activeFilter.value)
})

async function refresh() {
  transaksi.value = await finance.fetchTransaksi(user.value.id, { limit: 50 })
}

onMounted(async () => { if (user.value) await refresh() })

function openAdd() { editingTxn.value = null; form.value = emptyForm(); showForm.value = true }
function openEdit(txn) {
  editingTxn.value = txn
  form.value = { tipe: txn.tipe, jumlah: txn.jumlah, kategori: txn.kategori, catatan: txn.catatan || '', tanggal: txn.tanggal }
  showForm.value = true
}
function closeForm() { showForm.value = false; editingTxn.value = null }
function confirmDelete(txn) { deletingTxn.value = txn }

async function handleSubmit() {
  if (!form.value.kategori) {
    goeyToast.error('Gagal menyimpan', { description: 'Silakan pilih kategori terlebih dahulu' })
    return
  }
  submitting.value = true
  try {
    if (editingTxn.value) {
      await finance.updateTransaksi(editingTxn.value.id, form.value)
      goeyToast.success('Transaksi berhasil diperbarui', { description: form.value.kategori })
    } else {
      await finance.addTransaksi({ user_id: user.value.id, ...form.value })
      goeyToast.success('Transaksi ditambahkan', { description: form.value.kategori })
    }
    await refresh()
    closeForm()
  } catch (err) {
    goeyToast.error('Gagal menyimpan', { description: err.message })
  } finally {
    submitting.value = false
  }
}

async function handleDelete() {
  if (!deletingTxn.value) return
  submitting.value = true
  try {
    await finance.deleteTransaksi(deletingTxn.value.id)
    goeyToast.success('Transaksi dihapus', { description: deletingTxn.value.kategori })
    await refresh()
    deletingTxn.value = null
  } catch (err) {
    goeyToast.error('Gagal menghapus', { description: err.message })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* List item transitions */
.list-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.list-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 1, 1); }
.list-enter-from   { opacity: 0; transform: translateY(12px); }
.list-leave-to     { opacity: 0; transform: translateX(-12px); }
.list-move         { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
</style>
