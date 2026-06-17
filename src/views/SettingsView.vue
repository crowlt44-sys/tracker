<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-dark-base">Pengaturan</h1>
      <p class="text-sm text-gray-400 mt-0.5">Kelola profil dan preferensi akun Anda</p>
    </div>

    <div class="max-w-2xl mx-auto animate-fade-up">
      <!-- User ID Card -->
      <div class="relative w-full rounded-[32px] overflow-hidden bg-dark-base p-6 sm:p-8 mb-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-white/5 group">
        <div class="absolute -right-12 -top-12 w-64 h-64 bg-gradient-to-br from-kuning-pastel/20 to-transparent rounded-full blur-[64px] group-hover:scale-110 transition-transform duration-700"></div>
        <div class="flex items-center gap-5 relative z-10">
          <div class="relative w-20 h-20 rounded-full border-2 border-white/20 p-1 shrink-0 shadow-[0_0_20px_rgba(255,210,84,0.15)] bg-white/5">
            <img
              :src="avatarSrc"
              alt="Profile"
              class="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <div class="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-2 inline-flex items-center">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              <span class="text-[9px] font-bold text-white tracking-widest uppercase">Akun Terverifikasi</span>
            </div>
            <h3 class="text-2xl font-extrabold text-white tracking-tight">{{ profile?.nama_lengkap || 'Pengguna' }}</h3>
            <p class="text-sm text-gray-400 mt-0.5 font-medium">{{ user?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-6 sm:p-8 mb-6">
        <h4 class="text-xs font-bold text-dark-base uppercase tracking-widest mb-6 flex items-center gap-2">
          <HugeiconsIcon :icon="UserIcon" class="w-4 h-4 text-kuning-600" />
          Informasi Pribadi
        </h4>
        <form @submit.prevent="handleUpdate" class="space-y-5">
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Nama Lengkap</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HugeiconsIcon :icon="UserCircleIcon" class="h-5 w-5 text-gray-400 group-focus-within:text-[#E5B53C] transition-colors" />
              </div>
              <input v-model="form.nama_lengkap" type="text" required class="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-cream-200 shadow-sm rounded-2xl text-sm font-semibold text-dark-base focus:ring-2 focus:ring-[#FFD254] focus:border-transparent transition-all backdrop-blur-sm outline-none" placeholder="Masukkan nama lengkap" />
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">URL Avatar (opsional)</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HugeiconsIcon :icon="Image01Icon" class="h-5 w-5 text-gray-400 group-focus-within:text-[#E5B53C] transition-colors" />
              </div>
              <input v-model="form.avatar_url" type="url" class="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-cream-200 shadow-sm rounded-2xl text-sm font-semibold text-dark-base focus:ring-2 focus:ring-[#FFD254] focus:border-transparent transition-all backdrop-blur-sm outline-none" placeholder="https://example.com/avatar.jpg" />
            </div>
          </div>
          <div class="pt-2">
            <button
              type="submit"
              :disabled="saving"
              class="w-full px-8 py-3.5 bg-kuning-pastel text-dark-base text-sm font-extrabold rounded-2xl shadow-[0_4px_12px_rgba(255,210,84,0.3)] hover:bg-[#FCE588] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Logout Container -->
      <div class="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-4">
        <button
          @click="handleLogout"
          class="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-2xl transition-all group"
        >
          <span class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-red-500/20 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <HugeiconsIcon :icon="Logout03Icon" class="w-4 h-4" />
            </div>
            Keluar dari Akun
          </span>
          <HugeiconsIcon :icon="ArrowRight01Icon" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useFinance } from '@/composables/useFinance'
import { goeyToast } from 'goey-toast-vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import { Logout03Icon, UserIcon, UserCircleIcon, Image01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

const router = useRouter()
const { user, signOut } = useAuth()
const finance = useFinance()

const profile = ref(null)
const saving = ref(false)

const form = ref({
  nama_lengkap: '',
  avatar_url: ''
})

onMounted(async () => {
  if (!user.value) return
  profile.value = await finance.fetchProfile(user.value.id)
  form.value = {
    nama_lengkap: profile.value?.nama_lengkap || '',
    avatar_url: profile.value?.avatar_url || ''
  }
})

const avatarSrc = computed(() => {
  if (form.value.avatar_url) return form.value.avatar_url
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(form.value.nama_lengkap || 'User')}&background=FFD254&color=1E1E1E&size=64`
})

async function handleUpdate() {
  saving.value = true
  try {
    await finance.updateProfile(user.value.id, form.value)
    profile.value = await finance.fetchProfile(user.value.id)
    goeyToast.success('Profil berhasil diperbarui!')
  } catch (err) {
    goeyToast.error('Gagal memperbarui', { description: err.message })
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  await signOut()
  router.push('/auth')
}
</script>
