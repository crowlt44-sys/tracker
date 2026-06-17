<template>
  <header class="sticky top-0 z-40 glass border-b border-white/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">

        <!-- Logo -->
        <div class="flex items-center group cursor-pointer" @click="router.push('/')">
          <span
            class="text-2xl font-bold text-dark-base tracking-tight transition-all duration-300 group-hover:tracking-normal select-none"
            style="font-family: 'Elms Sans', sans-serif;"
          >
            .tracker
          </span>
        </div>

        <!-- Desktop Pill Nav with sliding indicator -->
        <div class="hidden lg:block">
          <AnimatedPillNav
            :items="navItems"
            :model-value="currentRoute"
            @select="navigateTo"
          />
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-3">
          <!-- Monthly spend badge -->
          <div class="text-right hidden sm:block group cursor-default">
            <p class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Pengeluaran Bulan Ini</p>
            <p class="text-sm font-bold text-dark-base transition-all duration-300 group-hover:text-red-500">
              {{ formatRupiah(totalPengeluaran) }}
            </p>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="$emit('toggle-sidebar')"
            class="lg:hidden p-2.5 rounded-xl hover:bg-cream-200 transition-all duration-200 active:scale-90 btn-ripple"
            aria-label="Toggle menu"
          >
            <Bars3Icon class="w-5 h-5 text-dark-base" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom progress shimmer line -->
    <div class="h-[2px] w-full bg-gradient-to-r from-transparent via-kuning-pastel/40 to-transparent" />
  </header>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { formatRupiah } from '@/utils/format'
import AnimatedPillNav from '@/components/ui/AnimatedPillNav.vue'

const props = defineProps({
  totalPengeluaran: { type: Number, default: 0 }
})

defineEmits(['toggle-sidebar'])

const router = useRouter()
const route = useRoute()

const navItems = [
  { key: 'Dashboard', label: 'Dashboard' },
  { key: 'Transactions', label: 'Transaksi' },
  { key: 'Bills', label: 'Tagihan' },
  { key: 'Reports', label: 'Laporan' },
  { key: 'Settings', label: 'Pengaturan' }
]

const currentRoute = computed(() => route.name || 'Dashboard')

function navigateTo(key) {
  const paths = {
    Dashboard: '/',
    Transactions: '/transaksi',
    Bills: '/tagihan',
    Reports: '/laporan',
    Settings: '/pengaturan'
  }
  router.push(paths[key])
}
</script>
