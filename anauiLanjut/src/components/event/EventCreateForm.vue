
<script setup>
import { reactive, ref } from 'vue'
import AppCard from '../ui/AppCard.vue'
import AppButton from '../ui/AppButton.vue'

const emit = defineEmits(['submit', 'cancel'])

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const form = reactive({
  title: '',
  cat: 'Workshop',
  date: '',
  loc: '',
  quota: 100,
  price: 'Free',
  desc: '',
})

const errorMessage = ref('')
const successMessage = ref('')
const fieldErrors = reactive({
  title: '',
  date: '',
  loc: '',
  quota: '',
  desc: '',
})

function formatEventDate(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

function handleSubmitEvent() {
  errorMessage.value = ''
  successMessage.value = ''
  Object.keys(fieldErrors).forEach((field) => {
    fieldErrors[field] = ''
  })

  if (props.loading) return

  if (!form.title.trim()) fieldErrors.title = 'Judul acara wajib diisi.'
  if (!form.date) fieldErrors.date = 'Tanggal dan waktu wajib diisi.'
  if (!form.loc.trim()) fieldErrors.loc = 'Lokasi acara wajib diisi.'
  if (!form.desc.trim()) fieldErrors.desc = 'Deskripsi acara wajib diisi.'
  if (Object.values(fieldErrors).some(Boolean)) {
    errorMessage.value = 'Lengkapi semua kolom yang wajib diisi.'
    return
  }

  if (new Date(form.date).getTime() < Date.now()) {
    fieldErrors.date = 'Tanggal acara tidak boleh di masa lalu.'
    errorMessage.value = fieldErrors.date
    return
  }

  if (
    !Number.isFinite(Number(form.quota)) ||
    Number(form.quota) < 1
  ) {
    fieldErrors.quota = 'Kuota peserta minimal 1.'
    errorMessage.value = fieldErrors.quota
    return
  }

  const eventData = {
    title: form.title.trim(),
    cat: form.cat,
    date: formatEventDate(form.date),
    loc: form.loc.trim(),
    quota: Number(form.quota),
    price: form.price,
    desc: form.desc.trim(),
  }

  emit('submit', eventData)
}

function handleSuccess() {
  form.title = ''
  form.cat = 'Workshop'
  form.date = ''
  form.loc = ''
  form.quota = 100
  form.price = 'Free'
  form.desc = ''

  errorMessage.value = ''
  successMessage.value = 'Acara berhasil dipublikasikan.'
  Object.keys(fieldErrors).forEach((field) => {
    fieldErrors[field] = ''
  })
}

function handleError(message) {
  errorMessage.value = message || 'Gagal menyimpan acara.'
  successMessage.value = ''
}

function clearFieldError(field) {
  fieldErrors[field] = ''
  if (!Object.values(fieldErrors).some(Boolean)) {
    errorMessage.value = ''
  }
}

defineExpose({
  handleSuccess,
  handleError,
})
</script>

<template>
  <AppCard class="form-card">
    <h3>Create New Event Form</h3>

    <p class="form-subtitle">
      Informasi yang dimasukkan akan dikirim ke halaman pengelolaan acara.
    </p>

    <div v-if="errorMessage" class="alert-box alert-error" role="alert">
      ⚠️ {{ errorMessage }}
    </div>

    <div
      v-if="successMessage"
      class="alert-box alert-success"
      role="status"
    >
      ✓ {{ successMessage }}
    </div>

    <form class="event-form" novalidate @submit.prevent="handleSubmitEvent">
      <div class="form-group">
        <label for="event-title">Event Title *</label>
        <input
          id="event-title"
          v-model.trim="form.title"
          type="text"
          placeholder="Contoh: Modern UI/UX Masterclass"
          class="form-input"
          :disabled="loading"
          :class="{ 'is-invalid': fieldErrors.title }"
          @input="clearFieldError('title')"
          required
        />
        <small v-if="fieldErrors.title" class="field-error">{{ fieldErrors.title }}</small>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="event-category">Event Category *</label>
          <select
            id="event-category"
            v-model="form.cat"
            class="form-input"
            :disabled="loading"
          >
            <option value="Workshop">Workshop</option>
            <option value="Meetup">Meetup</option>
            <option value="Competition">Competition</option>
            <option value="Seminar">Seminar</option>
            <option value="Conference">Conference</option>
          </select>
        </div>

        <div class="form-group">
          <label for="event-date">Date & Time *</label>
          <input
            id="event-date"
            v-model="form.date"
            type="datetime-local"
            class="form-input"
            :disabled="loading"
            :class="{ 'is-invalid': fieldErrors.date }"
            @change="clearFieldError('date')"
            required
          />
          <small v-if="fieldErrors.date" class="field-error">{{ fieldErrors.date }}</small>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="event-location">Event Location *</label>
          <input
            id="event-location"
            v-model.trim="form.loc"
            type="text"
            placeholder="Contoh: Innovation Center, Jakarta"
            class="form-input"
            :disabled="loading"
            :class="{ 'is-invalid': fieldErrors.loc }"
            @input="clearFieldError('loc')"
            required
          />
          <small v-if="fieldErrors.loc" class="field-error">{{ fieldErrors.loc }}</small>
        </div>

        <div class="form-group">
          <label for="event-quota">Attendee Quota *</label>
          <input
            id="event-quota"
            v-model.number="form.quota"
            type="number"
            min="1"
            placeholder="100"
            class="form-input"
            :disabled="loading"
            :class="{ 'is-invalid': fieldErrors.quota }"
            @input="clearFieldError('quota')"
            required
          />
          <small v-if="fieldErrors.quota" class="field-error">{{ fieldErrors.quota }}</small>
        </div>
      </div>

      <div class="form-group">
        <label for="event-price">Registration Price *</label>
        <select
          id="event-price"
          v-model="form.price"
          class="form-input"
          :disabled="loading"
        >
          <option value="Free">Gratis</option>
          <option value="50000">Rp50.000</option>
          <option value="100000">Rp100.000</option>
          <option value="150000">Rp150.000</option>
          <option value="200000">Rp200.000</option>
        </select>
      </div>

      <div class="form-group">
        <label for="event-description">Event Description *</label>
        <textarea
          id="event-description"
          v-model.trim="form.desc"
          rows="4"
          placeholder="Jelaskan agenda, pembicara, dan informasi acara..."
          class="form-input"
          :disabled="loading"
          :class="{ 'is-invalid': fieldErrors.desc }"
          @input="clearFieldError('desc')"
          required
        ></textarea>
        <small v-if="fieldErrors.desc" class="field-error">{{ fieldErrors.desc }}</small>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn-secondary-action"
          :disabled="loading"
          @click="emit('cancel')"
        >
          Batal
        </button>

        <AppButton
          variant="primary"
          type="submit"
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? 'Menyimpan...' : '📣 Publikasikan Acara' }}
        </AppButton>
      </div>
    </form>
  </AppCard>
</template>

<style scoped>
.form-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
}

h3 {
  margin: 0 0 8px;
  color: #27272a;
  font-size: 22px;
}

.form-subtitle {
  margin: 0 0 24px;
  color: #71717a;
  font-size: 14px;
  line-height: 1.6;
}

.alert-box {
  margin-bottom: 18px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.alert-error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.alert-success {
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #3f3f46;
  font-size: 13px;
  font-weight: 600;
}

.form-input {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  outline: none;
  background: #ffffff;
  color: #27272a;
  font: inherit;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #5145cd;
  box-shadow: 0 0 0 3px rgb(81 69 205 / 12%);
}

.form-input.is-invalid {
  border-color: #ef4444;
  background: #fff7f7;
}

.form-input.is-invalid:focus {
  box-shadow: 0 0 0 3px rgb(239 68 68 / 12%);
}

.field-error {
  color: #dc2626;
  font-size: 12px;
}

.form-input:disabled {
  background: #f4f4f5;
  cursor: not-allowed;
}

textarea.form-input {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
  padding-top: 20px;
  border-top: 1px solid #e4e4e7;
}

.btn-secondary-action {
  padding: 11px 16px;
  border: 1px solid #d4d4d8;
  border-radius: 9px;
  background: #f4f4f5;
  color: #52525b;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary-action:hover:not(:disabled) {
  background: #e4e4e7;
}

.btn-secondary-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .form-card {
    padding: 18px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
