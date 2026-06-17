<template>
  <div :class="[
    'glass rounded-3xl p-5 sm:p-6 transition-all duration-300',
    hoverable ? 'hover:shadow-xl hover:-translate-y-0.5 cursor-pointer' : '',
    customClass
  ]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  hoverable: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
})
</script>
