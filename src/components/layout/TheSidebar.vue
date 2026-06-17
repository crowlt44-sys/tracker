<template>
  <!-- Mobile Drawer Overlay -->
  <Transition name="drawer">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 lg:hidden"
      @click.self="$emit('update:modelValue', false)"
    >
      <!-- Backdrop -->
      <Transition name="fade-bg">
        <div class="absolute inset-0 bg-black/25 backdrop-blur-sm" />
      </Transition>

      <!-- Drawer panel -->
      <div class="absolute right-0 top-0 h-full w-72 glass-strong p-6 flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8 animate-slide-right delay-50">
          <span
            class="text-xl font-bold text-dark-base tracking-tight select-none"
            style="font-family: 'Elms Sans', sans-serif;"
          >
            .tracker
          </span>
          <button
            @click="$emit('update:modelValue', false)"
            class="p-1.5 rounded-xl hover:bg-cream-200 transition-all duration-200 active:scale-90 btn-ripple"
          >
            <HugeiconsIcon :icon="Cancel01Icon" class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <!-- Nav items -->
        <nav class="space-y-1 flex-1">
          <button
            v-for="(item, i) in navItems"
            :key="item.key"
            @click="navigateTo(item.key)"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-250 btn-ripple animate-slide-right group"
            :class="[
              currentRoute === item.key
                ? 'bg-dark-base text-white shadow-md shadow-dark-base/20'
                : 'text-gray-500 hover:bg-cream-200/60 hover:text-dark-base',
              `delay-${(i + 1) * 50}`
            ]"
            :style="{ animationDelay: (100 + i * 50) + 'ms' }"
          >
            <HugeiconsIcon
              :icon="item.icon"
              class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
              :stroke-width="currentRoute === item.key ? 2.5 : 1.5"
            />
            <span>{{ item.label }}</span>
            <HugeiconsIcon
              :icon="ArrowRight01Icon"
              v-if="currentRoute !== item.key"
              class="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
            />
            <div v-if="currentRoute === item.key" class="w-1.5 h-1.5 rounded-full bg-kuning-pastel ml-auto animate-pulse" />
          </button>
        </nav>

        <!-- Logout -->
        <div class="pt-5 border-t border-cream-200/70 animate-fade-up delay-400">
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-50 transition-all duration-200 group btn-ripple"
          >
            <HugeiconsIcon :icon="Logout03Icon" class="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Mobile Bottom Nav -->
  <div
    class="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex justify-center pointer-events-none"
    style="padding-bottom: env(safe-area-inset-bottom, 20px)"
  >
    <div class="pointer-events-auto w-[92%] max-w-[360px]">
      <div class="glass-pill rounded-[40px] px-2 py-2.5 flex items-center justify-around">

        <!-- Left items -->
        <template v-for="item in leftItems" :key="item.key">
          <button
            @click="navigateTo(item.key)"
            class="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300 min-w-[54px] group btn-ripple"
            :class="currentRoute === item.key ? 'text-dark-base' : 'text-gray-400'"
          >
            <!-- Active background pill -->
            <Transition name="nav-bg">
              <span
                v-if="currentRoute === item.key"
                class="absolute inset-0 bg-kuning-pastel/20 rounded-2xl"
              />
            </Transition>

            <HugeiconsIcon
              :icon="item.icon"
              class="relative w-5 h-5 transition-all duration-300"
              :class="currentRoute === item.key ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-105'"
              :stroke-width="currentRoute === item.key ? 2.5 : 1.5"
            />
            <span
              class="relative text-[10px] font-semibold leading-none transition-all duration-300"
              :class="currentRoute === item.key ? 'opacity-100' : 'opacity-50 group-hover:opacity-70'"
            >
              {{ item.label }}
            </span>

            <!-- Active dot -->
            <Transition name="dot">
              <span
                v-if="currentRoute === item.key"
                class="absolute -bottom-0.5 w-1 h-1 bg-kuning-pastel rounded-full"
              />
            </Transition>
          </button>
        </template>

        <!-- Center FAB -->
        <button
          @click="navigateTo('Transactions')"
          class="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 -mt-5 btn-ripple group"
          :class="[
            currentRoute === 'Transactions'
              ? 'bg-dark-base shadow-xl shadow-dark-base/40 scale-105'
              : 'bg-dark-base shadow-lg shadow-dark-base/25 hover:scale-105 hover:shadow-xl hover:shadow-dark-base/35'
          ]"
        >
          <!-- Glow ring for active -->
          <div
            v-if="currentRoute === 'Transactions'"
            class="absolute inset-0 rounded-2xl animate-pulse-glow"
          />
          <HugeiconsIcon
            :icon="Wallet02Icon"
            class="w-6 h-6 text-kuning-pastel transition-transform duration-300"
            :class="currentRoute === 'Transactions' ? 'scale-110' : 'group-hover:scale-105'"
            :stroke-width="currentRoute === 'Transactions' ? 2.5 : 1.5"
          />
          <span
            class="text-[9px] font-semibold leading-none mt-0.5"
            :class="currentRoute === 'Transactions' ? 'text-kuning-pastel' : 'text-white/70'"
          >
            Transaksi
          </span>
        </button>

        <!-- Right items -->
        <template v-for="item in rightItems" :key="item.key">
          <button
            @click="navigateTo(item.key)"
            class="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300 min-w-[54px] group btn-ripple"
            :class="currentRoute === item.key ? 'text-dark-base' : 'text-gray-400'"
          >
            <Transition name="nav-bg">
              <span
                v-if="currentRoute === item.key"
                class="absolute inset-0 bg-kuning-pastel/20 rounded-2xl"
              />
            </Transition>

            <HugeiconsIcon
              :icon="item.icon"
              class="relative w-5 h-5 transition-all duration-300"
              :class="currentRoute === item.key ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-105'"
              :stroke-width="currentRoute === item.key ? 2.5 : 1.5"
            />
            <span
              class="relative text-[10px] font-semibold leading-none transition-all duration-300"
              :class="currentRoute === item.key ? 'opacity-100' : 'opacity-50 group-hover:opacity-70'"
            >
              {{ item.label }}
            </span>

            <Transition name="dot">
              <span
                v-if="currentRoute === item.key"
                class="absolute -bottom-0.5 w-1 h-1 bg-kuning-pastel rounded-full"
              />
            </Transition>
          </button>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Cancel01Icon,
  Logout03Icon,
  Home11Icon,
  Wallet02Icon,
  Analytics01Icon,
  Notification01Icon,
  Setting07Icon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const route = useRoute()
const { signOut } = useAuth()

const navItems = [
  { key: 'Dashboard', label: 'Home', icon: Home11Icon },
  { key: 'Transactions', label: 'Transaksi', icon: Wallet02Icon },
  { key: 'Bills', label: 'Tagihan', icon: Notification01Icon },
  { key: 'Reports', label: 'Laporan', icon: Analytics01Icon },
  { key: 'Settings', label: 'Profil', icon: Setting07Icon }
]

const leftItems = computed(() => navItems.filter(i => ['Dashboard', 'Bills'].includes(i.key)))
const rightItems = computed(() => navItems.filter(i => ['Reports', 'Settings'].includes(i.key)))

const currentRoute = computed(() => route.name || 'Dashboard')

function navigateTo(key) {
  emit('update:modelValue', false)
  const paths = {
    Dashboard: '/',
    Transactions: '/transaksi',
    Bills: '/tagihan',
    Reports: '/laporan',
    Settings: '/pengaturan'
  }
  router.push(paths[key])
}

async function handleLogout() {
  await signOut()
  router.push('/auth')
}
</script>

<style scoped>
/* Drawer slide-in from right */
.drawer-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-leave-active { transition: all 0.28s cubic-bezier(0.4, 0, 1, 1); }
.drawer-enter-from .glass-strong { transform: translateX(100%); opacity: 0; }
.drawer-leave-to .glass-strong   { transform: translateX(100%); opacity: 0; }
.drawer-enter-from { opacity: 0; }
.drawer-leave-to   { opacity: 0; }

/* Fade for backdrop */
.fade-bg-enter-active, .fade-bg-leave-active { transition: opacity 0.3s ease; }
.fade-bg-enter-from, .fade-bg-leave-to { opacity: 0; }

/* Nav item bg pill */
.nav-bg-enter-active, .nav-bg-leave-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.nav-bg-enter-from { opacity: 0; transform: scale(0.85); }
.nav-bg-leave-to   { opacity: 0; transform: scale(0.85); }

/* Active dot */
.dot-enter-active, .dot-leave-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.dot-enter-from { opacity: 0; transform: scale(0) translateY(4px); }
.dot-leave-to   { opacity: 0; transform: scale(0) translateY(4px); }
</style>
