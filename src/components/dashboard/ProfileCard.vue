<template>
  <div class="glass rounded-3xl p-6 flex flex-col items-center text-center">
    <div class="w-20 h-20 rounded-full bg-gradient-to-br from-kuning-pastel to-kuning-200 p-0.5 mb-3 shrink-0">
      <img
        :src="avatarSrc"
        :alt="profile?.nama_lengkap || 'User'"
        class="w-full h-full rounded-full object-cover bg-white"
      />
    </div>
    <h2 class="text-lg font-bold text-dark-base">{{ profile?.nama_lengkap || 'Pengguna' }}</h2>
    <p class="text-xs text-gray-400 font-medium mb-4">Financial Freedom Seeker</p>
    <div class="w-full p-4 bg-cream-200/60 rounded-2xl">
      <p class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total Kekayaan Bersih</p>
      <p class="text-2xl font-extrabold text-dark-base mt-1 tracking-tight">{{ formatRupiah(netWorth) }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRupiah } from '@/utils/format'

const props = defineProps({
  profile: { type: Object, default: null },
  netWorth: { type: Number, default: 0 }
})

const avatarSrc = computed(() => {
  if (props.profile?.avatar_url) return props.profile.avatar_url
  const name = props.profile?.nama_lengkap || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFD254&color=1E1E1E&size=80&font-size=0.4&bold=true`
})
</script>
