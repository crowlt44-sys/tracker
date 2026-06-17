<template>
  <div v-if="!authLoading" class="min-h-screen flex flex-col">
    <template v-if="user">
      <TheHeader
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        :total-pengeluaran="totalPengeluaran"
      />
      <Teleport to="body">
        <GoeyToaster position="top-center" :rich-colors="true" :close-button="true" />
      </Teleport>
      <main class="flex-1 pb-28 lg:pb-0">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>

        <!-- Footer Watermark -->
        <footer class="mt-auto py-6 text-center text-xs font-medium text-gray-400">
          Powered by <span class="font-bold text-dark-base opacity-70 hover:opacity-100 hover:text-kuning-pastel transition-all cursor-pointer">magerans.id</span>
        </footer>
      </main>
      <TheSidebar v-model="sidebarOpen" />
    </template>
    <template v-else>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </template>
  </div>

  <!-- Auth loading splash -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="flex flex-col items-center gap-4 animate-fade-in">
      <span
        class="text-4xl font-bold text-dark-base tracking-tight animate-float select-none"
        style="font-family: 'Elms Sans', sans-serif;"
      >
        .tracker
      </span>
      <div class="flex items-center gap-1.5">
        <div v-for="i in 3" :key="i"
          class="w-1.5 h-1.5 rounded-full bg-kuning-pastel animate-bounce"
          :style="{ animationDelay: (i - 1) * 150 + 'ms' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useAuth } from '@/composables/useAuth'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import { GoeyToaster } from 'goey-toast-vue'

const { user, loading: authLoading } = useAuth()
const sidebarOpen = ref(false)
const totalPengeluaran = ref(0)

provide('totalPengeluaran', totalPengeluaran)
</script>

<style>
/* Page transition */
.page-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
