<template>
  <div class="relative">
    <Listbox v-model="internalValue" :disabled="disabled">
      <div class="relative">
        <ListboxButton
          :class="[
            'relative w-full rounded-xl py-3 pl-4 pr-10 text-left text-xs outline-none border-0 shadow-sm transition-all focus:ring-2 focus:ring-kuning-pastel',
            disabled ? 'opacity-50 cursor-not-allowed bg-cream-50' : 'cursor-pointer bg-cream-100 hover:bg-cream-200 focus:bg-white',
            internalValue ? 'text-dark-base font-semibold' : 'text-gray-400 font-medium'
          ]"
        >
          <span class="block truncate">{{ internalValue || placeholder }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronUpDownIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm custom-scrollbar"
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
                  active ? 'bg-cream-100 text-dark-base' : 'text-gray-600',
                  'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors'
                ]"
              >
                <span :class="[selected ? 'font-bold text-dark-base' : 'font-medium', 'block truncate text-xs']">
                  {{ option }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-kuning-300"
                >
                  <CheckIcon class="h-4 w-4" aria-hidden="true" />
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
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

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
