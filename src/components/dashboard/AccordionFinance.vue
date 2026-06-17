<template>
  <div class="glass rounded-3xl p-2">
    <div v-for="(section, index) in sections" :key="index">
      <button
        @click="toggle(index)"
        class="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-cream-200/50 transition-colors"
      >
        <div class="flex items-center gap-3">
          <component :is="section.icon" class="w-5 h-5 text-gray-400 shrink-0" />
          <span class="text-sm font-medium text-dark-base">{{ section.label }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-dark-base">{{ section.amount }}</span>
          <ChevronDownIcon
            :class="[
              'w-4 h-4 text-gray-400 transition-transform duration-200',
              openIndex === index ? 'rotate-180' : ''
            ]"
          />
        </div>
      </button>
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-80 opacity-100"
        leave-from-class="max-h-80 opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-if="openIndex === index" class="overflow-hidden">
          <div class="px-3 pb-3 space-y-2">
            <div
              v-for="(item, i) in section.items"
              :key="i"
              class="flex items-center justify-between py-1.5"
            >
              <span class="text-xs text-gray-500">{{ item.label }}</span>
              <span class="text-xs font-semibold text-dark-base">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

defineProps({
  sections: { type: Array, required: true }
})

const openIndex = ref(-1)

function toggle(index) {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>
