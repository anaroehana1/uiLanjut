
import { ref, computed, watch } from 'vue';

// STORAGE KEYS
const EVENTS_STORAGE_KEY = 'gatherly_events';
const REGISTRATIONS_STORAGE_KEY = 'gatherly_user_registrations';

// REST API CONFIGURATION
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  return envUrl ? envUrl.trim().replace(/\/+$/, '') : '';
};

// STATE SINGLET​ON
const savedData = localStorage.getItem(EVENTS_STORAGE_KEY);
const events = ref(savedData ? JSON.parse(savedData) : []);

const savedRegs = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
const userRegistrations = ref(
  savedRegs ? JSON.parse(savedRegs) : []
);

// ASYNCHRONOUS NETWORK STATES
const loading = ref(false);
const error = ref(null);

// CACHE EVENT KE LOCAL STORAGE
watch(
  events,
  (newEvents) => {
    localStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(newEvents)
    );
  },
  { deep: true }
);

// CACHE PENDAFTARAN KE LOCAL STORAGE
watch(
  userRegistrations,
  (newRegs) => {
    localStorage.setItem(
      REGISTRATIONS_STORAGE_KEY,
      JSON.stringify(newRegs)
    );
  },
  { deep: true }
);

export function useEvents() {

  // DERIVED STATE
  const totalEvents = computed(() => events.value.length);

  const activeEvents = computed(() =>
    events.value.filter((e) => !e.done)
  );

  const completedEvents = computed(() =>
    events.value.filter((e) => e.done)
  );

  const totalRegistrations = computed(
    () => userRegistrations.value.length
  );

  // 1. HTTP GET: MENGAMBIL SELURUH DATA EVENT
  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;

    const baseUrl = getApiBaseUrl();

    if (!baseUrl) {
      error.value = 'Alamat REST API belum dikonfigurasi. Periksa file .env.';
      loading.value = false;
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/events`);

      if (!response.ok) {
        throw new Error(
          `Gagal memuat data dari server (Status HTTP: ${response.status})`
        );
      }

      const data = await response.json();
      if (
        !Array.isArray(data) ||
        data.some((event) => !event || typeof event !== 'object' || event.id == null)
      ) {
        throw new Error('Format data acara dari server tidak valid.');
      }

      events.value = data;

    } catch (err) {
      error.value =
        err.message || 'Terjadi kegagalan jaringan saat menghubungi server API.';
    } finally {
      loading.value = false;
    }
  };

  // 2. HTTP GET BY ID: MENGAMBIL RINCIAN EVENT
  const fetchEventById = async (id) => {
    if (!id) return null;

    const strId = String(id);

    const baseUrl = getApiBaseUrl();
    error.value = null;
    if (!baseUrl) {
      error.value = 'Alamat REST API belum dikonfigurasi. Periksa file .env.';
      return null;
    }

    loading.value = true;

    try {
      const response = await fetch(
        `${baseUrl}/events/${encodeURIComponent(strId)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Acara tidak ditemukan pada sistem server.');
        }

        throw new Error(
          `Gagal mengambil detail acara (Status HTTP: ${response.status})`
        );
      }

      const eventData = await response.json();
      if (!eventData || typeof eventData !== 'object' || eventData.id == null) {
        throw new Error('Format detail acara dari server tidak valid.');
      }

      if (!events.value.some(
        (e) => String(e.id) === String(eventData.id)
      )) {
        events.value.push(eventData);
      }

      return eventData;

    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 3. HTTP POST: MEMBUAT DATA ACARA BARU
  const createEvent = async (eventData) => {
    loading.value = true;
    error.value = null;

    const cleanLoc = (eventData.loc || '')
      .replace(/^[📍\s]+/, '')
      .trim();

    const payload = {
      title: eventData.title.trim(),
      date: eventData.date,
      loc: cleanLoc,
      cat: eventData.cat,
      quota: Number(eventData.quota) || 100,
      price: eventData.price || 'Free',
      desc: (eventData.desc || '').trim(),
      done: false
    };

    const baseUrl = getApiBaseUrl();

    try {
      let createdEvent;

      if (baseUrl) {
        const response = await fetch(`${baseUrl}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(
            `Gagal menyimpan acara ke server (Status HTTP: ${response.status})`
          );
        }

        createdEvent = await response.json();

      } else {
        throw new Error('Alamat REST API belum dikonfigurasi.');
      }

      events.value.unshift(createdEvent);
      return createdEvent;

    } catch (err) {
      error.value = err.message || 'Gagal menyimpan data ke server API.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 4. HTTP DELETE: MENGHAPUS EVENT DARI SERVER
  const deleteEvent = async (id) => {
    const strId = String(id);

    loading.value = true;
    error.value = null;

    const baseUrl = getApiBaseUrl();

    try {
      if (!baseUrl) {
        throw new Error('Alamat REST API belum dikonfigurasi.');
      }

      const response = await fetch(
        `${baseUrl}/events/${encodeURIComponent(strId)}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok && response.status !== 404) {
        throw new Error(
          `Gagal menghapus acara dari server (Status HTTP: ${response.status})`
        );
      }

      // Hapus data dari state lokal
      events.value = events.value.filter(
        (e) => String(e.id) !== strId
      );

      // Hapus tiket pendaftaran terkait
      userRegistrations.value =
        userRegistrations.value.filter(
          (r) => String(r.eventId) !== strId
        );

      return true;

    } catch (err) {
      error.value = err.message || 'Gagal menghapus acara dari server.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 5. MUTASI STATE: TANDAI EVENT SELESAI
  const completeEvent = async (id) => {
    const strId = String(id);

    const target = events.value.find(
      (e) => String(e.id) === strId
    );

    if (!target) return;

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        const response = await fetch(
          `${baseUrl}/events/${encodeURIComponent(strId)}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ done: true })
          }
        );

        if (!response.ok) {
          throw new Error('Gagal memperbarui status acara.');
        }

        const updatedEvent = await response.json();
        Object.assign(target, updatedEvent);

      } catch (err) {
        console.warn('Gagal memperbarui status selesai di server:', err);
        throw err;
      }
    } else {
      throw new Error('Alamat REST API belum dikonfigurasi.');
    }
  };

  // 6. PENCARIAN DATA SINKRON DARI STATE
  const getEventById = (id) => {
    return events.value.find(
      (e) => String(e.id) === String(id)
    );
  };

  // 7. PENDAFTARAN PESERTA
  const registerAttendee = (eventId, participantData) => {
    const strId = String(eventId);

    const event = events.value.find(
      (e) => String(e.id) === strId
    );

    if (!event || event.done || event.quota <= 0) {
      return null;
    }

    const registrationId = Date.now();

    const bookingCode =
      'GTH-' + registrationId.toString().slice(-4);

    const regRecord = {
      id: registrationId,
      eventId: event.id,
      eventTitle: event.title,
      eventCat: event.cat,
      eventDate: event.date,
      eventLoc: event.loc,
      bookingCode,
      registeredAt: new Date().toISOString(),
      fullname: participantData.fullname.trim(),
      email: participantData.email.trim(),
      phone: participantData.phone.trim(),
      dob: participantData.dob,
      reason: participantData.reason.trim()
    };

    // Kurangi kuota event
    event.quota = Math.max(0, event.quota - 1);

    // Simpan pendaftaran
    userRegistrations.value.unshift(regRecord);

    return regRecord;
  };

  // 8. CEK STATUS PENDAFTARAN
  const isUserRegistered = (eventId) => {
    const strId = String(eventId);

    const eventExists = events.value.some(
      (e) => String(e.id) === strId
    );

    if (!eventExists) return false;

    return userRegistrations.value.some(
      (r) => String(r.eventId) === strId
    );
  };

  // 9. MENGAMBIL TIKET BERDASARKAN EVENT ID
  const getRegistrationByEventId = (eventId) => {
    return userRegistrations.value.find(
      (r) => String(r.eventId) === String(eventId)
    );
  };

  // 10. PEMBATALAN PENDAFTARAN
  const cancelRegistration = (eventId) => {
    const strId = String(eventId);

    const regIdx = userRegistrations.value.findIndex(
      (r) => String(r.eventId) === strId
    );

    if (regIdx !== -1) {
      userRegistrations.value.splice(regIdx, 1);

      const event = events.value.find(
        (e) => String(e.id) === strId
      );

      if (event) {
        event.quota += 1;
      }

      return true;
    }

    return false;
  };

  // 11. RESET DATA PENGUJIAN
  const clearAllEvents = () => {
    events.value = [];
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  };

  const clearAllRegistrations = () => {
    userRegistrations.value = [];
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
  };

  return {
    events,
    loading,
    error,
    totalEvents,
    activeEvents,
    completedEvents,
    userRegistrations,
    totalRegistrations,
    fetchEvents,
    fetchEventById,
    createEvent,
    deleteEvent,
    completeEvent,
    getEventById,
    registerAttendee,
    isUserRegistered,
    getRegistrationByEventId,
    cancelRegistration,
    clearAllEvents,
    clearAllRegistrations
  };
}
