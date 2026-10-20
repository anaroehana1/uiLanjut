<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: 'Action Confirmation' },
  message: { type: String, default: 'Are you sure you want to proceed with this action?' },
  confirmText: { type: String, default: 'Yes, Proceed' },
  cancelText: { type: String, default: 'Cancel' },
  confirmVariant: { type: String, default: 'danger' }
});

defineEmits(['confirm', 'close']);
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">{{ title }}</h3>
        </div>
        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>
          <slot />
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" type="button" @click="$emit('close')">{{ cancelText }}</button>
          <button :class="['btn-confirm', `btn-confirm--${confirmVariant}`]" type="button" @click="$emit('confirm')">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 460px;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.modal-icon { font-size: 1.8rem; line-height: 1; }
.modal-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0; }
.modal-body { margin-bottom: 1.5rem; }
.modal-message { color: #64748b; font-size: 0.95rem; line-height: 1.6; margin: 0; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; }

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-cancel:hover { background: #e2e8f0; color: #1e293b; }

.btn-confirm {
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-confirm--danger { background: #e63946; }
.btn-confirm--danger:hover { background: #d62828; }
.btn-confirm--success { background: #22a447; }
.btn-confirm--success:hover { background: #16803c; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>