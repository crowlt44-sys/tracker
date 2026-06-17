<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-xl font-bold text-dark-base">Pengaturan</h1>
      <p class="text-sm text-gray-400 mt-0.5">Kelola profil dan preferensi akun</p>
    </div>

    <div class="glass rounded-3xl p-5 sm:p-6 max-w-2xl">
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-cream-200">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-kuning-pastel to-kuning-200 p-0.5 shrink-0">
          <img
            :src="avatarSrc"
            alt="Profile"
            class="w-full h-full rounded-full object-cover bg-white"
          />
        </div>
        <div>
          <h3 class="text-sm font-bold text-dark-base">{{ profile?.nama_lengkap || 'Pengguna' }}</h3>
          <p class="text-xs text-gray-400">{{ user?.email }}</p>
        </div>
      </div>

      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div>
          <label class="text-xs font-medium text-gray-500 mb-1.5 block">Nama Lengkap</label>
          <input v-model="form.nama_lengkap" type="text" required class="input-field" />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 mb-1.5 block">URL Avatar (opsional)</label>
          <input v-model="form.avatar_url" type="url" class="input-field" placeholder="https://example.com/avatar.jpg" />
        </div>
        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-2.5 bg-dark-base text-white text-sm font-semibold rounded-xl hover:bg-dark-soft transition-colors disabled:opacity-50"
        >
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-cream-200">
        <button
          @click="handleLogout"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
          Keluar
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
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

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
    alert('Profil berhasil diperbarui!')
  } catch (err) {
    alert('Gagal: ' + err.message)
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  await signOut()
  router.push('/auth')
}
</script>
