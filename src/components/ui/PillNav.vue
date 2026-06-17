<template>
  <nav class="flex items-center gap-1 bg-cream-200/60 rounded-full p-1.5">
    <button
      v-for="item in items"
      :key="item.key"
      @click="$emit('select', item.key)"
      class="pill-base"
      :class="modelValue === item.key ? 'pill-active' : 'pill-inactive'"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  modelValue: { type: String, required: true }
})

defineEmits(['select'])
</script>
