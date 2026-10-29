<template>
  <form class="registration-form" @submit.prevent="submitForm">
    <div class="form-heading">
      <h2>Registration Form</h2>
      <p>Fill out the attendee information below to confirm your participation.</p>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="fullname">Full Name <span>*</span></label>
        <input
          id="fullname"
          v-model.trim="form.fullname"
          type="text"
          placeholder="Enter your full name"
          autocomplete="name"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email Address <span>*</span></label>
        <input
          id="email"
          v-model.trim="form.email"
          type="email"
          placeholder="name@email.com"
          autocomplete="email"
          required
        />
      </div>

      <div class="form-group">
        <label for="phone">Phone Number <span>*</span></label>
        <input
          id="phone"
          v-model.trim="form.phone"
          type="tel"
          placeholder="Enter your phone number"
          autocomplete="tel"
          required
        />
      </div>

      <div class="form-group">
        <label for="dob">Date of Birth <span>*</span></label>
        <input
          id="dob"
          v-model="form.dob"
          type="date"
          autocomplete="bday"
          required
        />
      </div>

      <div class="form-group form-group--full">
        <label for="reason">Reason for Attending <span>*</span></label>
        <textarea
          id="reason"
          v-model.trim="form.reason"
          rows="5"
          placeholder="Tell us why you want to attend this event"
          required
        ></textarea>
      </div>
    </div>

    <p v-if="errorMessage" class="form-error" role="alert">
      {{ errorMessage }}
    </p>

    <div class="form-actions">
      <button type="button" class="button button--secondary" @click="handleCancel">
        Cancel
      </button>
      <button type="submit" class="button button--primary" :disabled="submitting">
        {{ submitting ? 'Processing...' : 'Confirm Registration' }}
      </button>
    </div>
    <p class="form-note"><span>*</span> Required fields</p>
  </form>
</template>

<script setup>
import { reactive, ref, computed, onBeforeUnmount } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const submitting = ref(false)
const errorMessage = ref('')
let submitTimeout

const form = reactive({
  fullname: '',
  email: '',
  phone: '',
  dob: '',
  reason: '',
})

const isFormDirty = computed(() =>
  Object.values(form).some((value) => String(value).trim() !== '')
)

function submitForm() {
  errorMessage.value = ''

  if (!form.fullname || !form.email || !form.phone || !form.dob || !form.reason) {
    errorMessage.value = 'Please complete all required fields.'
    return
  }

  if (submitting.value) return

  submitting.value = true
  emit('submit', { ...form })

  submitTimeout = setTimeout(() => {
    submitting.value = false
  }, 1500)
}

function handleCancel() {
  if (isFormDirty.value) {
    const confirmed = window.confirm(
      'Your form has unsaved information. Are you sure you want to cancel?'
    )

    if (!confirmed) return
  }

  emit('cancel')
}

onBeforeUnmount(() => {
  if (submitTimeout) clearTimeout(submitTimeout)
})
</script>

<style scoped>
.registration-form {
  padding: 22px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 18px rgb(28 25 72 / 4%);
}

.form-heading {
  margin-bottom: 22px;
}

.form-heading h2 {
  margin: 0 0 6px;
  color: #1c1948;
  font-size: 22px;
}

.form-heading p {
  margin: 0;
  color: #71717a;
  font-size: 13px;
  line-height: 1.6;
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-group label {
  color: #343247;
  font-size: 13px;
  font-weight: 600;
}

.form-group label span,
.form-note span {
  color: #dc2626;
}

.form-group input,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  background: #fafafa;
  color: #27272a;
  font: inherit;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: 2px solid #c4b5fd;
  border-color: #6644ff;
  background: #ffffff;
}

.form-group textarea {
  min-height: 112px;
  resize: vertical;
}

.form-error {
  margin: 14px 0 0;
  color: #b91c1c;
  font-size: 13px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e4e4e7;
}

.button {
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button--primary {
  background: #6644ff;
  color: #ffffff;
}

.button--secondary {
  border-color: #e4e4e7;
  background: #ffffff;
  color: #3f3f46;
}

.form-note {
  margin: 12px 0 0;
  color: #71717a;
  font-size: 12px;
}

@media (max-width: 600px) {
  .registration-form {
    padding: 18px;
  }
}
</style>
