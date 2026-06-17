import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

export function useToast() {
  function show({ message, type = 'info', duration = 3500, title = '' }) {
    const id = ++nextId
    toasts.value.push({ id, message, type, title, duration, progress: 100 })

    // Auto remove
    setTimeout(() => remove(id), duration)
  }

  function remove(id) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  const success = (message, title = 'Berhasil') => show({ message, type: 'success', title })
  const error   = (message, title = 'Gagal')    => show({ message, type: 'error',   title })
  const warning = (message, title = 'Perhatian')=> show({ message, type: 'warning',  title })
  const info    = (message, title = 'Info')     => show({ message, type: 'info',     title })

  return { toasts, show, remove, success, error, warning, info }
}
