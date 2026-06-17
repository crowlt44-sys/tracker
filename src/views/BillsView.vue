<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-dark-base">Tagihan</h1>
        <p class="text-sm text-gray-400 mt-0.5">Kelola tagihan rutin dan cicilan</p>
      </div>
      <button
        @click="showForm = true"
        class="flex items-center gap-2 px-4 py-2.5 bg-dark-base text-white text-sm font-semibold rounded-xl hover:bg-dark-soft transition-colors"
      >
        <PlusIcon class="w-4 h-4" />
        Tambah
      </button>
    </div>

    <div class="glass rounded-3xl p-5 sm:p-6">
      <div v-if="bills.length" class="space-y-2">
        <div
          v-for="bill in bills"
          :key="bill.id"
          class="flex items-center gap-4 p-3 sm:p-4 rounded-2xl hover:bg-cream-200/50 transition-colors"
        >
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              bill.sudah_dibayar ? 'bg-green-500/15' : 'bg-kuning-pastel/20'
            ]"
          >
            <CheckCircleIcon v-if="bill.sudah_dibayar" class="w-5 h-5 text-green-500" />
            <ClockIcon v-else class="w-5 h-5 text-kuning-300" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-dark-base">{{ bill.nama }}</p>
            <p class="text-xs text-gray-400">
              Jatuh tempo tgl {{ bill.tanggal_jatuh_tempo }}
              <span v-if="bill.kategori">&middot; {{ bill.kategori }}</span>
            </p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-sm font-bold text-dark-base">{{ formatRupiah(bill.jumlah) }}</p>
            <button
              v-if="!bill.sudah_dibayar"
              @click="togglePaid(bill)"
              class="text-[10px] text-kuning-pastel font-semibold hover:underline"
            >
              Tandai dibayar
            </button>
            <span v-else class="text-[10px] text-green-500 font-semibold">Lunas</span>
          </div>
        </div>
      </div>
      <EmptyState v-else :icon="BellIcon" title="Belum ada tagihan" description="Tambahkan tagihan rutin untuk pengingat otomatis" />
    </div>

    <!-- Modal Form -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-dark-base">Tambah Tagihan</h3>
            <button type="button" @click="showForm = false" class="w-8 h-8 flex items-center justify-center rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-400 hover:text-gray-600 transition-colors">
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
import { PlusIcon, BellIcon, CheckCircleIcon, ClockIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { supabase } from '@/composables/useSupabase'
import EmptyState from '@/components/ui/EmptyState.vue'

const { user } = useAuth()
const finance = useFinance()

const bills = ref([])
const showForm = ref(false)
const submitting = ref(false)

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

async function handleAdd() {
  submitting.value = true
  try {
    await finance.addBill({ user_id: user.value.id, ...newBill.value })
    bills.value = await finance.fetchBills(user.value.id)
    showForm.value = false
    newBill.value = { nama: '', jumlah: null, tanggal_jatuh_tempo: null, kategori: '' }
  } catch (err) {
    alert('Gagal menyimpan: ' + err.message)
  } finally {
    submitting.value = false
  }
}

async function togglePaid(bill) {
  const { error } = await supabase
    .from('bills')
    .update({ sudah_dibayar: !bill.sudah_dibayar })
    .eq('id', bill.id)
  if (!error) {
    bills.value = await finance.fetchBills(user.value.id)
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
