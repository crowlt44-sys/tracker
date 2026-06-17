<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white via-cream-50 to-cream-200">
    <div class="w-full max-w-md">
      <div class="glass-strong rounded-3xl p-8">
        <div class="text-center mb-8">
          <div class="w-14 h-14 bg-kuning-pastel rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-kuning-pastel/20">
            <span class="text-dark-base font-extrabold text-2xl">T</span>
          </div>
          <h1 class="text-2xl font-extrabold text-dark-base">Tracker</h1>
          <p class="text-sm text-gray-400 mt-1.5">Catat keuanganmu, raih mimpimu</p>
        </div>

        <div class="flex bg-cream-200/60 rounded-xl p-1 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
              activeTab === tab.key
                ? 'bg-white shadow-sm text-dark-base'
                : 'text-gray-400 hover:text-gray-600'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <template v-if="activeTab === 'register'">
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">Nama Lengkap</label>
              <input
                v-model="form.namaLengkap"
                type="text"
                required
                class="input-field"
                placeholder="Nama Anda"
              />
            </div>
          </template>
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1.5 block">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1.5 block">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              :minlength="activeTab === 'register' ? 6 : 1"
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-dark-base text-white font-semibold rounded-xl hover:bg-dark-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{{ loading ? 'Memproses...' : (activeTab === 'login' ? 'Masuk' : 'Daftar') }}</span>
          </button>
        </form>

        <div v-if="message" :class="['mt-5 p-3 rounded-2xl text-xs font-medium text-center', message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500']">
          {{ message.text }}
        </div>

        <p v-if="activeTab === 'login' && message?.type === 'success'" class="mt-3 text-xs text-center text-gray-400">
          Setelah login, buka halaman <router-link to="/" class="text-kuning-pastel font-semibold hover:underline">Dashboard</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { signIn, signUp } = useAuth()

const activeTab = ref('login')
const loading = ref(false)
const message = ref(null)

const tabs = [
  { key: 'login', label: 'Masuk' },
  { key: 'register', label: 'Daftar' }
]

const form = reactive({
  email: '',
  password: '',
  namaLengkap: ''
})

async function handleSubmit() {
  loading.value = true
  message.value = null

  try {
    if (activeTab.value === 'login') {
      await signIn(form.email, form.password)
      router.push('/')
    } else {
      const data = await signUp(form.email, form.password, form.namaLengkap)
      if (data?.user?.identities?.length === 0) {
        message.value = { type: 'error', text: 'Email sudah terdaftar. Silakan masuk.' }
      } else {
        message.value = {
          type: 'success',
          text: 'Pendaftaran berhasil! Silakan cek email untuk konfirmasi, lalu masuk.'
        }
        activeTab.value = 'login'
      }
    }
  } catch (err) {
    message.value = { type: 'error', text: err.message }
  } finally {
    loading.value = false
  }
}
</script>
