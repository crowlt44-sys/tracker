<template>
  <div class="relative">
    <Listbox v-model="internalValue" :disabled="disabled">
      <div class="relative">
        <ListboxButton
          :class="[
            'relative w-full rounded-full py-2 pl-4 pr-8 text-left text-xs outline-none border transition-all duration-300',
            disabled ? 'opacity-50 cursor-not-allowed bg-white/40 border-white/40' : 'cursor-pointer bg-white/60 backdrop-blur-md border-white/80 hover:bg-white focus:ring-2 focus:ring-dark-base shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md',
            internalValue ? 'text-dark-base font-bold' : 'text-gray-400 font-medium'
          ]"
        >
          <span class="block truncate">{{ internalValue || placeholder }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <HugeiconsIcon :icon="ArrowUpDownIcon" class="h-4 w-4 text-gray-400" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute right-0 z-50 mt-2 max-h-60 min-w-[140px] overflow-auto rounded-2xl bg-white/95 backdrop-blur-2xl py-2 text-base shadow-[0_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-dark-base/5 border border-white focus:outline-none sm:text-sm custom-scrollbar origin-top-right"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="option in options"
              :key="option"
              :value="option"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-cream-100/50 text-dark-base' : 'text-gray-500',
                  'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-200 mx-2 rounded-xl'
                ]"
              >
                <span :class="[selected ? 'font-extrabold text-dark-base' : 'font-medium', 'block truncate text-sm sm:text-xs tracking-wide']">
                  {{ option }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-kuning-500"
                >
                  <HugeiconsIcon :icon="CheckIcon" class="h-4 w-4" stroke-width="2.5" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import { CheckIcon, ArrowUpDownIcon } from '@hugeicons/core-free-icons'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Pilih opsi'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 20px;
}
</style>
