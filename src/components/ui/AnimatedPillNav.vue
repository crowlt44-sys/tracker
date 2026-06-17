<template>
  <nav class="relative flex items-center bg-cream-200/60 rounded-full p-1.5" ref="navRef">
    <!-- Sliding background indicator -->
    <div
      class="absolute rounded-full bg-dark-base shadow-md pointer-events-none"
      :style="indicatorStyle"
    />

    <button
      v-for="(item, i) in items"
      :key="item.key"
      :ref="el => { if (el) btnRefs[i] = el }"
      @click="handleSelect(item.key)"
      class="relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap"
      :class="modelValue === item.key ? 'text-white' : 'text-gray-500 hover:text-gray-700'"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['select'])

const navRef = ref(null)
const btnRefs = ref([])
const indicatorStyle = ref({ width: '0px', left: '0px', height: '36px', top: '6px', transition: 'none' })

function updateIndicator(animate = true) {
  nextTick(() => {
    const activeIndex = props.items.findIndex(i => i.key === props.modelValue)
    const btn = btnRefs.value[activeIndex]
    const nav = navRef.value
    if (!btn || !nav) return

    const navRect = nav.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()

    indicatorStyle.value = {
      width: btnRect.width + 'px',
      left: (btnRect.left - navRect.left) + 'px',
      height: btnRect.height + 'px',
      top: (btnRect.top - navRect.top) + 'px',
      transition: animate ? 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
    }
  })
}

function handleSelect(key) {
  emit('select', key)
}

watch(() => props.modelValue, () => updateIndicator(true))
onMounted(() => updateIndicator(false))
</script>
