
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="handleCancel"
        @keydown.esc="handleCancel"
      >
        <section
          class="modal-panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'modal-title' : undefined"
        >
          <header v-if="title || showClose" class="modal-header">
            <h2 v-if="title" id="modal-title" class="modal-title">
              {{ title }}
            </h2>

            <button
              v-if="showClose"
              type="button"
              class="modal-close"
              aria-label="Tutup dialog"
              @click="handleCancel"
            >
              &times;
            </button>
          </header>

          <div class="modal-body">
            <slot />
          </div>

          <footer class="modal-footer">
            <slot name="footer">
              <button
                v-if="showCancel"
                type="button"
                class="modal-button modal-button--secondary"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>

              <button
                v-if="showConfirm"
                type="button"
                class="modal-button"
                :class="confirmVariantClass"
                :disabled="confirmDisabled"
                @click="$emit('confirm')"
              >
                {{ confirmText }}
              </button>
            </slot>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  confirmText: {
    type: String,
    default: 'Konfirmasi',
  },
  confirmVariant: {
    type: String,
    default: 'primary',
  },
  confirmDisabled: {
    type: Boolean,
    default: false,
  },
  closeOnCancel: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const confirmVariantClass = computed(() => {
  return props.confirmVariant === 'danger'
    ? 'modal-button--danger'
    : 'modal-button--primary'
})

function handleCancel() {
  emit('cancel')

  if (props.closeOnCancel) {
    emit('update:modelValue', false)
  }
}

function handleEscape(event) {
  if (event.key === 'Escape' && props.modelValue) {
    handleCancel()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (typeof document === 'undefined') return

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    } else {
      document.removeEventListener('keydown', handleEscape)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgb(24 24 27 / 55%);
  backdrop-filter: blur(5px);
}

.modal-panel {
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgb(0 0 0 / 18%);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #e4e4e7;
}

.modal-title {
  margin: 0;
  color: #18181b;
  font-size: 18px;
  font-weight: 700;
}

.modal-close {
  border: 0;
  background: transparent;
  color: #71717a;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
  color: #3f3f46;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #e4e4e7;
}

.modal-button {
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 9px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.modal-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-button--primary {
  background: #5145cd;
  color: #ffffff;
}

.modal-button--danger {
  background: #dc2626;
  color: #ffffff;
}

.modal-button--secondary {
  border-color: #e4e4e7;
  background: #ffffff;
  color: #3f3f46;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: translateY(12px) scale(0.98);
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 12px;
  }

  .modal-header,
  .modal-body {
    padding: 18px;
  }

  .modal-footer {
    padding: 14px 18px;
  }
}
</style>
