
<script setup>
import { reactive, ref } from 'vue'
import AppCard from '../ui/AppCard.vue'
import AppButton from '../ui/AppButton.vue'

const emit = defineEmits(['submit', 'cancel'])

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

  if (
    !form.title.trim() ||
    !form.date ||
    !form.loc.trim() ||
    !form.desc.trim()
  ) {
    errorMessage.value = 'Semua kolom wajib diisi.'
    return
  }

  if (new Date(form.date).getTime() < Date.now()) {
    errorMessage.value = 'Tanggal acara tidak boleh di masa lalu.'
    return
  }

  if (!Number.isFinite(Number(form.quota)) || Number(form.quota) < 1) {
    errorMessage.value = 'Kuota peserta minimal 1.'
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

  form.title = ''
  form.cat = 'Workshop'
  form.date = ''
  form.loc = ''
  form.quota = 100
  form.price = 'Free'
  form.desc = ''

  successMessage.value = 'Data acara berhasil dikirim.'
}
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

    <form class="event-form" @submit.prevent="handleSubmitEvent">
      <div class="form-group">
        <label for="event-title">Event Title *</label>
        <input
          id="event-title"
          v-model.trim="form.title"
          type="text"
          placeholder="Contoh: Modern UI/UX Masterclass"
          class="form-input"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="event-category">Event Category *</label>
          <select
            id="event-category"
            v-model="form.cat"
            class="form-input"
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
            required
          />
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
            required
          />
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
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="event-price">Registration Price *</label>
        <select
          id="event-price"
          v-model="form.price"
          class="form-input"
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
          required
        ></textarea>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn-secondary-action"
          @click="emit('cancel')"
        >
          Batal
        </button>

        <AppButton variant="primary" type="submit">
          📣 Publikasikan Acara
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

.btn-secondary-action:hover {
  background: #e4e4e7;
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
