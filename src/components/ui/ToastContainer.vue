<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast" tag="div" class="toast-stack">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.type}`"
          @click="remove(toast.id)"
        >
          <!-- Icon -->
          <div class="toast-icon-wrap">
            <HugeiconsIcon :icon="iconMap[toast.type]" class="toast-icon" />
          </div>

          <!-- Content -->
          <div class="toast-content">
            <p v-if="toast.title" class="toast-title">{{ toast.title }}</p>
            <p class="toast-message">{{ toast.message }}</p>
          </div>

          <!-- Close -->
          <button class="toast-close" @click.stop="remove(toast.id)">
            <HugeiconsIcon :icon="Cancel01Icon" class="w-3.5 h-3.5" />
          </button>

          <!-- Progress bar -->
          <div class="toast-progress">
            <div
              class="toast-progress-bar"
              :style="{ animationDuration: toast.duration + 'ms' }"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Alert01Icon,
  InformationCircleIcon,
  Cancel01Icon
} from '@hugeicons/core-free-icons'

const { toasts, remove } = useToast()

const iconMap = {
  success: CheckmarkCircle01Icon,
  error:   AlertCircleIcon,
  warning: Alert01Icon,
  info:    InformationCircleIcon,
}
</script>

<style scoped>
/* ── Container ───────────────────────────────────────────────── */
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  pointer-events: none;
}

.toast-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

/* ── Toast Item ──────────────────────────────────────────────── */
.toast-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  min-width: 300px;
  max-width: 380px;
  border-radius: 18px;
  cursor: pointer;
  pointer-events: all;
  overflow: hidden;

  /* Glassmorphism base */
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.toast-item:hover {
  transform: translateX(-3px) scale(1.01);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.06);
}

/* ── Type variants ───────────────────────────────────────────── */
.toast-success { border-left: 3px solid #22c55e; }
.toast-error   { border-left: 3px solid #ef4444; }
.toast-warning { border-left: 3px solid #f59e0b; }
.toast-info    { border-left: 3px solid #6366f1; }

/* ── Icon ────────────────────────────────────────────────────── */
.toast-icon-wrap {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
.toast-success .toast-icon-wrap { background: rgba(34, 197, 94, 0.12); }
.toast-error   .toast-icon-wrap { background: rgba(239, 68, 68, 0.12); }
.toast-warning .toast-icon-wrap { background: rgba(245, 158, 11, 0.12); }
.toast-info    .toast-icon-wrap { background: rgba(99, 102, 241, 0.12); }

.toast-icon { width: 18px; height: 18px; }
.toast-success .toast-icon { color: #16a34a; }
.toast-error   .toast-icon { color: #dc2626; }
.toast-warning .toast-icon { color: #d97706; }
.toast-info    .toast-icon { color: #4f46e5; }

/* ── Content ─────────────────────────────────────────────────── */
.toast-content { flex: 1; min-width: 0; }

.toast-title {
  font-size: 13px;
  font-weight: 700;
  color: #1E1E1E;
  margin-bottom: 2px;
  line-height: 1.3;
}

.toast-message {
  font-size: 12.5px;
  color: #6B7280;
  line-height: 1.4;
}

/* ── Close Button ────────────────────────────────────────────── */
.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  transition: background 0.15s ease, color 0.15s ease;
  margin-top: -2px;
}
.toast-close:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #374151;
}

/* ── Progress Bar ────────────────────────────────────────────── */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 0 0 18px 18px;
  overflow: hidden;
}

@keyframes shrink {
  from { width: 100%; }
  to   { width: 0%; }
}

.toast-progress-bar {
  height: 100%;
  border-radius: 999px;
  animation: shrink linear forwards;
}
.toast-success .toast-progress-bar { background: #22c55e; }
.toast-error   .toast-progress-bar { background: #ef4444; }
.toast-warning .toast-progress-bar { background: #f59e0b; }
.toast-info    .toast-progress-bar { background: #6366f1; }

/* ── Transition ──────────────────────────────────────────────── */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 1, 1);
  position: absolute;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(80px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.88);
}
.toast-move {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ── Mobile ──────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .toast-container {
    top: auto;
    bottom: 100px;
    right: 12px;
    left: 12px;
  }
  .toast-item {
    min-width: unset;
    max-width: 100%;
    width: 100%;
  }
  .toast-stack { align-items: stretch; }
}
</style>
