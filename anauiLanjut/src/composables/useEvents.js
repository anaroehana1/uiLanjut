
import { ref, computed, watch } from 'vue';

// DATA AWAL
const defaultEvents = [
  {
    id: 1,
    title: 'Vue.js Mastery Workshop',
    date: '2026-10-22T17:49:00',
    loc: 'QBig BSD City',
    cat: 'Workshop',
    quota: 150,
    price: 'Free',
    desc: 'A practical workshop on Vue 3, Composition API, and building modern web applications.',
    done: false,
  },
  {
    id: 2,
    title: 'Design to Employ: Bridging Academia and the Creative Industry!',
    date: '2026-10-23T10:30:00',
    loc: 'Jakarta Convention Center',
    cat: 'Workshop',
    quota: 1000,
    price: 'Free',
    desc: 'Bridge the gap between academic learning and the creative industry through portfolio reviews, industry insights, and professional networking.',
    done: false,
  },
  {
    id: 3,
    title: 'National Tech Meetup',
    date: '2026-10-25T09:00:00',
    loc: 'Main Auditorium, City Center',
    cat: 'Meetup',
    quota: 200,
    price: 'Free',
    desc: 'A gathering of developers and tech enthusiasts to share industry trends and expand professional networks.',
    done: false,
  },
  {
    id: 4,
    title: 'Startup Pitch Competition',
    date: '2026-11-02T13:00:00',
    loc: 'Innovation Center',
    cat: 'Competition',
    quota: 120,
    price: 'Free',
    desc: 'Watch startup founders pitch innovative ideas in front of a panel of investors.',
    done: false,
  },
  {
    id: 5,
    title: 'Digital Marketing Seminar',
    date: '2026-11-20T10:00:00',
    loc: 'Grand Hotel Hall',
    cat: 'Seminar',
    quota: 180,
    price: 'Free',
    desc: 'Explore modern digital marketing strategies, from SEO optimization to user conversion.',
    done: false,
  },
  {
    id: 6,
    title: 'Community Leaders Summit',
    date: '2026-12-05T09:00:00',
    loc: 'Gatherly HQ',
    cat: 'Conference',
    quota: 250,
    price: 'Free',
    desc: 'A conference for community leaders to discuss sustainable ecosystem development.',
    done: false,
  },
];

// STORAGE KEYS
const EVENTS_STORAGE_KEY = 'gatherly_events';
const REGISTRATIONS_STORAGE_KEY = 'gatherly_user_registrations';

// SINGLE SOURCE OF TRUTH
const savedData = localStorage.getItem(EVENTS_STORAGE_KEY);
const events = ref(
  savedData ? JSON.parse(savedData) : defaultEvents
);

const savedRegs = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
const userRegistrations = ref(
  savedRegs ? JSON.parse(savedRegs) : []
);

// SINKRONISASI STATE KE LOCAL STORAGE
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

  // TAMBAH EVENT
  const createEvent = (eventData) => {
    const cleanLoc = (eventData.loc || '')
      .replace(/^[📍\s]+/, '')
      .trim();

    const newEvent = {
      id: Date.now(),
      title: eventData.title,
      date: eventData.date,
      loc: cleanLoc,
      cat: eventData.cat,
      quota: Number(eventData.quota) || 100,
      price: eventData.price || 'Free',
      desc: eventData.desc || '',
      done: false
    };

    events.value.unshift(newEvent);
    return newEvent;
  };

  // UBAH STATUS EVENT MENJADI SELESAI
  const completeEvent = (id) => {
    const target = events.value.find(
      (e) => e.id === Number(id)
    );

    if (target) {
      target.done = true;
    }
  };

  // HAPUS EVENT DAN PENDAFTARAN TERKAIT
  const deleteEvent = (id) => {
    const numId = Number(id);

    const index = events.value.findIndex(
      (e) => e.id === numId
    );

    if (index !== -1) {
      events.value.splice(index, 1);
    }

    // Hapus tiket yang terkait dengan event tersebut
    userRegistrations.value =
      userRegistrations.value.filter(
        (r) => r.eventId !== numId
      );
  };

  // CARI EVENT BERDASARKAN ID
  const getEventById = (id) => {
    return events.value.find(
      (e) => e.id === Number(id)
    );
  };

  // DAFTARKAN PESERTA
  const registerAttendee = (eventId, participantData) => {
    const event = events.value.find(
      (e) => e.id === Number(eventId)
    );

    if (!event || event.done || event.quota <= 0) {
      return null;
    }

    const registrationId = Date.now();
    const bookingCode =
      'GTH-' + registrationId.toString().slice(-4);

    const regRecord = {
      id: registrationId,
      eventId: Number(eventId),
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

    // Kurangi kuota secara reaktif
    event.quota = Math.max(0, event.quota - 1);

    // Simpan pendaftaran
    userRegistrations.value.unshift(regRecord);

    return regRecord;
  };

  // CEK APAKAH PENGGUNA SUDAH MENDAFTAR
  const isUserRegistered = (eventId) => {
    const numId = Number(eventId);

    const eventExists = events.value.some(
      (e) => e.id === numId
    );

    if (!eventExists) {
      return false;
    }

    return userRegistrations.value.some(
      (r) => r.eventId === numId
    );
  };

  // AMBIL PENDAFTARAN BERDASARKAN EVENT
  const getRegistrationByEventId = (eventId) => {
    return userRegistrations.value.find(
      (r) => r.eventId === Number(eventId)
    );
  };

  // BATALKAN PENDAFTARAN
  const cancelRegistration = (eventId) => {
    const regIdx = userRegistrations.value.findIndex(
      (r) => r.eventId === Number(eventId)
    );

    if (regIdx !== -1) {
      userRegistrations.value.splice(regIdx, 1);

      const event = events.value.find(
        (e) => e.id === Number(eventId)
      );

      if (event) {
        event.quota += 1;
      }

      return true;
    }

    return false;
  };

  // RESET DATA EVENT
  const clearAllEvents = () => {
    events.value = [];
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  };

  // RESET DATA PENDAFTARAN
  const clearAllRegistrations = () => {
    userRegistrations.value = [];
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
  };

  return {
    events,
    totalEvents,
    activeEvents,
    completedEvents,
    userRegistrations,
    totalRegistrations,
    createEvent,
    completeEvent,
    deleteEvent,
    getEventById,
    registerAttendee,
    isUserRegistered,
    getRegistrationByEventId,
    cancelRegistration,
    clearAllEvents,
    clearAllRegistrations
  };
}
