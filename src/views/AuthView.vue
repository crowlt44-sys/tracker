<template>
  <div class="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-animated-gradient selection:bg-kuning-pastel/30 selection:text-dark-base">
    <!-- Animated Orbs Background (Light Mode) -->
    <div class="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-kuning-pastel/30 rounded-full blur-[100px] animate-pulse-glow mix-blend-multiply" style="animation-duration: 8s;"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-orange-300/20 rounded-full blur-[100px] animate-pulse-glow mix-blend-multiply" style="animation-duration: 10s; animation-delay: 2s;"></div>

    <div class="w-full max-w-md relative z-10 animate-fade-up">
      <div class="bg-white/80 backdrop-blur-3xl border border-white/80 shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden">
        
        <!-- Decorative subtle shine on the card -->
        <div class="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>

        <div class="text-center mb-10 relative z-10">
          <div class="mb-4">
            <span class="text-4xl font-extrabold text-dark-base tracking-tight select-none font-elms">
              .tracker
            </span>
          </div>
          <p class="text-sm text-gray-500 font-medium">Catat keuanganmu, raih mimpimu</p>
        </div>

        <div class="relative z-10">
          <div class="relative flex bg-cream-200/50 backdrop-blur-sm border border-white/50 rounded-2xl p-1.5 mb-8">
            <div 
              class="absolute top-1.5 bottom-1.5 left-1.5 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white transition-all duration-300 ease-out"
              :style="{ 
                width: 'calc(50% - 6px)',
                transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)'
              }"
            ></div>
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'flex-1 py-3 text-sm font-bold rounded-xl transition-colors duration-300 relative z-10',
                activeTab === tab.key ? 'text-dark-base' : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <template v-if="activeTab === 'register'">
              <div class="group relative animate-fade-in">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Nama Lengkap</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HugeiconsIcon :icon="UserIcon" class="h-5 w-5 text-gray-400 group-focus-within:text-[#E5B53C] transition-colors duration-300" />
                  </div>
                  <input
                    v-model="form.namaLengkap"
                    type="text"
                    required
                    class="block w-full pl-11 pr-4 py-3.5 bg-white/60 border border-cream-200/60 shadow-sm rounded-2xl text-sm font-semibold text-dark-base focus:ring-2 focus:ring-[#FFD254] focus:bg-white focus:border-transparent transition-all backdrop-blur-sm outline-none placeholder:text-gray-400"
                    placeholder="Nama Anda"
                  />
                </div>
              </div>
            </template>
            
            <div class="group relative animate-fade-in delay-100">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HugeiconsIcon :icon="Mail01Icon" class="h-5 w-5 text-gray-400 group-focus-within:text-[#E5B53C] transition-colors duration-300" />
                </div>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="block w-full pl-11 pr-4 py-3.5 bg-white/60 border border-cream-200/60 shadow-sm rounded-2xl text-sm font-semibold text-dark-base focus:ring-2 focus:ring-[#FFD254] focus:bg-white focus:border-transparent transition-all backdrop-blur-sm outline-none placeholder:text-gray-400"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div class="group relative animate-fade-in delay-200">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HugeiconsIcon :icon="LockKeyIcon" class="h-5 w-5 text-gray-400 group-focus-within:text-[#E5B53C] transition-colors duration-300" />
                </div>
                <input
                  v-model="form.password"
                  type="password"
                  required
                  :minlength="activeTab === 'register' ? 6 : 1"
                  class="block w-full pl-11 pr-4 py-3.5 bg-white/60 border border-cream-200/60 shadow-sm rounded-2xl text-sm font-semibold text-dark-base focus:ring-2 focus:ring-[#FFD254] focus:bg-white focus:border-transparent transition-all backdrop-blur-sm outline-none tracking-widest placeholder:text-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div class="pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="btn-ripple w-full py-4 bg-gradient-to-br from-dark-base to-black shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-white font-extrabold rounded-2xl hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <!-- Shine effect -->
                <div class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
                
                <svg v-if="loading" class="animate-spin w-5 h-5 text-kuning-pastel" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span class="relative z-10">{{ loading ? 'Memproses...' : (activeTab === 'login' ? 'Masuk ke Akun' : 'Buat Akun') }}</span>
              </button>
            </div>
          </form>

          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-2 opacity-0"
          >
            <div v-if="message" :class="['mt-6 p-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border', message.type === 'success' ? 'bg-green-50/80 border-green-200 text-green-700' : 'bg-red-50/80 border-red-200 text-red-600']">
              <HugeiconsIcon :icon="message.type === 'success' ? CheckmarkCircle01Icon : AlertCircleIcon" class="w-5 h-5 shrink-0" />
              {{ message.text }}
            </div>
          </Transition>

          <p v-if="activeTab === 'login' && message?.type === 'success'" class="mt-5 text-sm text-center text-gray-500 font-medium">
            Mengarahkan ke halaman <router-link to="/" class="text-dark-base font-bold underline decoration-kuning-pastel decoration-2 underline-offset-4 hover:text-kuning-600 transition-colors">Dashboard</router-link>...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  UserIcon,
  Mail01Icon,
  LockKeyIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon
} from '@hugeicons/core-free-icons'

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
