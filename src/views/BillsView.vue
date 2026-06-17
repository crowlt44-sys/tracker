<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-dark-base">Tagihan</h1>
      <p class="text-sm text-gray-400 mt-0.5">Kelola tagihan rutin dan cicilan Anda</p>
    </div>

    <!-- Summary Card -->
    <div
      class="relative bg-gradient-to-br from-gray-900 via-[#1A1C23] to-black rounded-[32px] p-6 sm:p-8 overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-up delay-100 group mb-6"
    >
      <div class="absolute -right-12 -top-12 w-64 h-64 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-[64px] group-hover:scale-110 transition-transform duration-700" />
      <div class="absolute -left-12 -bottom-12 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-[48px] group-hover:scale-110 transition-transform duration-700" />

      <div class="relative z-10">
        <p class="text-sm font-medium text-gray-400 mb-1">Total Belum Dibayar</p>
        <p class="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
          {{ formatRupiah(totalBelumDibayar) }}
        </p>
        
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex-1">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Sudah Dibayar</p>
            <p class="text-sm font-bold text-green-400">{{ formatRupiah(totalLunas) }}</p>
          </div>
          <button
            @click="showForm = true"
            class="bg-white text-dark-base rounded-2xl px-5 py-3 font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-transform flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            Tambah
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-5 sm:p-6 animate-fade-up delay-200">
      <div v-if="bills.length" class="space-y-2">
        <div
          v-for="bill in bills"
          :key="bill.id"
          class="flex items-center gap-4 py-4 sm:py-5 border-b border-cream-200/60 last:border-0 group"
        >
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all',
              bill.sudah_dibayar ? 'bg-green-500/10 group-hover:bg-green-500/20' : 'bg-kuning-pastel/20 group-hover:bg-kuning-pastel/30'
            ]"
          >
            <CheckCircleIcon v-if="bill.sudah_dibayar" class="w-6 h-6 text-green-500" />
            <ClockIcon v-else class="w-6 h-6 text-orange-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-dark-base">{{ bill.nama }}</p>
            <p class="text-xs text-gray-400">
              Jatuh tempo tgl {{ bill.tanggal_jatuh_tempo }}
              <span v-if="bill.kategori">&middot; {{ bill.kategori }}</span>
            </p>
          </div>
          <div class="flex flex-col items-end shrink-0 gap-1">
            <p class="text-sm font-bold text-dark-base">{{ formatRupiah(bill.jumlah) }}</p>
            <div class="flex items-center gap-2">
              <button
                v-if="!bill.sudah_dibayar"
                @click="togglePaid(bill)"
                class="text-[10px] text-kuning-pastel font-semibold hover:underline"
              >
                Tandai dibayar
              </button>
              <span v-else class="text-[10px] text-green-500 font-semibold">Lunas</span>
              
              <div class="flex items-center gap-1 ml-2 border-l border-gray-200 pl-2">
                <button @click="editBill(bill)" class="text-gray-400 hover:text-blue-500 transition-colors" title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button @click="confirmDelete(bill.id)" class="text-gray-400 hover:text-red-500 transition-colors" title="Hapus">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EmptyState v-else :icon="BellIcon" title="Belum ada tagihan" description="Tambahkan tagihan rutin untuk pengingat otomatis" />
    </div>

    <!-- Modal Form -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeForm">
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-dark-base">{{ isEditing ? 'Edit Tagihan' : 'Tambah Tagihan' }}</h3>
            <button type="button" @click="closeForm" class="w-8 h-8 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
          <form @submit.prevent="handleAdd" class="space-y-4">
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
            <button
              type="submit"
              :disabled="submitting"
              class="w-full py-3 bg-dark-base text-white font-semibold rounded-xl hover:bg-dark-soft transition-colors disabled:opacity-50"
            >
              {{ submitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Tagihan') }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="fade">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showDeleteModal = false">
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrashIcon class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-bold text-dark-base mb-2">Hapus Tagihan</h3>
          <p class="text-sm text-gray-500 mb-6">Apakah Anda yakin ingin menghapus tagihan ini? Tindakan ini tidak dapat dibatalkan.</p>
          <div class="flex gap-3">
            <button @click="showDeleteModal = false" class="flex-1 py-3 bg-cream-100 text-dark-base font-semibold rounded-xl hover:bg-cream-200 transition-colors">
              Batal
            </button>
            <button @click="executeDelete" :disabled="submittingDelete" class="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50">
              {{ submittingDelete ? 'Menghapus...' : 'Hapus' }}
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
import { PlusIcon, BellIcon, CheckCircleIcon, ClockIcon, XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { supabase } from '@/composables/useSupabase'
import EmptyState from '@/components/ui/EmptyState.vue'

const { user } = useAuth()
const finance = useFinance()

const bills = ref([])
const totalBelumDibayar = computed(() => bills.value.filter(b => !b.sudah_dibayar).reduce((s, b) => s + Number(b.jumlah), 0))
const totalLunas = computed(() => bills.value.filter(b => b.sudah_dibayar).reduce((s, b) => s + Number(b.jumlah), 0))
const showForm = ref(false)
const submitting = ref(false)
const isEditing = ref(false)
const editId = ref(null)

const showDeleteModal = ref(false)
const deleteId = ref(null)
const submittingDelete = ref(false)

const newBill = ref({
  nama: '',
  jumlah: null,
  tanggal_jatuh_tempo: null,
  kategori: ''
})

onMounted(async () => {
  if (!user.value) return
  bills.value = await finance.fetchBills(user.value.id)
})

function closeForm() {
  showForm.value = false
  isEditing.value = false
  editId.value = null
  newBill.value = { nama: '', jumlah: null, tanggal_jatuh_tempo: null, kategori: '' }
}

function editBill(bill) {
  isEditing.value = true
  editId.value = bill.id
  newBill.value = {
    nama: bill.nama,
    jumlah: bill.jumlah,
    tanggal_jatuh_tempo: bill.tanggal_jatuh_tempo,
    kategori: bill.kategori
  }
  showForm.value = true
}

async function handleAdd() {
  submitting.value = true
  try {
    if (isEditing.value) {
      await finance.updateBill(editId.value, { ...newBill.value })
      goeyToast.success('Tagihan diperbarui', { description: newBill.value.nama })
    } else {
      await finance.addBill({ user_id: user.value.id, ...newBill.value })
      goeyToast.success('Tagihan ditambahkan', { description: newBill.value.nama })
    }
    bills.value = await finance.fetchBills(user.value.id)
    closeForm()
  } catch (err) {
    goeyToast.error('Gagal menyimpan', { description: err.message })
  } finally {
    submitting.value = false
  }
}

function confirmDelete(id) {
  deleteId.value = id
  showDeleteModal.value = true
}

async function executeDelete() {
  if (!deleteId.value) return
  submittingDelete.value = true
  try {
    await finance.deleteBill(deleteId.value)
    goeyToast.success('Tagihan berhasil dihapus')
    bills.value = await finance.fetchBills(user.value.id)
    showDeleteModal.value = false
    deleteId.value = null
  } catch (err) {
    goeyToast.error('Gagal menghapus', { description: err.message })
  } finally {
    submittingDelete.value = false
  }
}

async function togglePaid(bill) {
  const { error } = await supabase
    .from('bills')
    .update({ sudah_dibayar: !bill.sudah_dibayar })
    .eq('id', bill.id)
  if (!error) {
    goeyToast.success(bill.sudah_dibayar ? 'Status diubah ke Belum Dibayar' : 'Status diubah ke Lunas')
    bills.value = await finance.fetchBills(user.value.id)
  } else {
    goeyToast.error('Gagal mengubah status', { description: error.message })
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
