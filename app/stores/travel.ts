export type TripActivity = {
  id: string
  title: string
  time: string
  date: string
  checked?: boolean
}

export type Trip = {
  id: string
  name: string
  startDate: string
  endDate: string
  activities: TripActivity[]
}

type NewTripInput = {
  name: string
  startDate: string
  endDate: string
}

type NewActivityInput = {
  title: string
  time: string
  date?: string
}

const TRIPS_STORAGE_KEY = 'roteiro_trips_v1'

const initialTrips: Trip[] = [
  {
    id: 'sp-2026',
    name: 'Sao Paulo',
    startDate: '2026-03-06',
    endDate: '2026-03-13',
    activities: [
      { id: 'a-1', date: '2026-03-06', title: 'Chegada e retirada do carro', time: '09:00' },
      { id: 'a-2', date: '2026-03-06', title: 'Check-in Airbnb (Bom Retiro) + Mercado', time: '11:00' },
      { id: 'a-3', date: '2026-03-06', title: 'Museu de Zoologia (Gratis)', time: '13:00' },
      { id: 'a-4', date: '2026-03-06', title: 'Museu do Ipiranga (Agendado)', time: '15:00' },
      { id: 'a-5', date: '2026-03-06', title: 'Japan House', time: '16:30' },
      { id: 'a-6', date: '2026-03-06', title: 'Mirante SESC Paulista (Reservar App)', time: '17:40' },
      { id: 'a-7', date: '2026-03-06', title: 'Passeio Avenida Paulista e Rua Augusta', time: '19:00' },
      { id: 'a-8', date: '2026-03-09', title: 'CASV - Vila Mariana', time: '08:30' },
      { id: 'a-9', date: '2026-03-10', title: 'Entrevista no Consulado', time: '08:00' },
      { id: 'a-10', date: '2026-03-10', title: 'MASP (Reservado)', time: '11:30' },
      { id: 'a-11', date: '2026-03-10', title: 'Bairro da Liberdade (Tour e Museus)', time: '13:30' },
      { id: 'a-12', date: '2026-03-10', title: 'Centro Historico (Se/Patio do Colegio/Theatro)', time: '16:00' },
      { id: 'a-13', date: '2026-03-11', title: 'Compras no Bras', time: '08:00' },
      { id: 'a-14', date: '2026-03-11', title: 'Mercado Municipal (Almoco)', time: '12:00' },
      { id: 'a-15', date: '2026-03-11', title: 'Rua 25 de Marco', time: '14:00' },
      { id: 'a-16', date: '2026-03-12', title: 'Pesquisar Translado Campos do Jordao', time: '09:00' },
      { id: 'a-17', date: '2026-03-13', title: 'Hopi Hari (Ate as 17h)', time: '10:00' },
      { id: 'a-18', date: '2026-03-13', title: 'Retorno - Embarque', time: '21:00' }
    ]
  }
]

export const useTravelStore = defineStore('travel', () => {
  const trips = ref<Trip[]>([...initialTrips])

  if (process.client) {
    try {
      const raw = localStorage.getItem(TRIPS_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Trip[]
        if (Array.isArray(parsed) && parsed.length) {
          trips.value = parsed
        }
      }
    } catch (error) {
      console.error('Falha ao carregar trips do localStorage:', error)
    }

    watch(
      trips,
      (value) => {
        localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(value))
      },
      { deep: true }
    )
  }

  const hasTrips = computed(() => trips.value.length > 0)

  function addTrip(payload: NewTripInput) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    trips.value.unshift({
      id,
      name: payload.name.trim(),
      startDate: payload.startDate,
      endDate: payload.endDate,
      activities: []
    })
    return id
  }

  function findTripById(id: string) {
    return trips.value.find((trip) => trip.id === id)
  }

  function addActivity(tripId: string, payload: NewActivityInput) {
    const trip = findTripById(tripId)
    if (!trip) {
      return false
    }

    trip.activities.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: payload.title.trim(),
      time: payload.time,
      date: payload.date || trip.startDate,
      checked: false
    })

    return true
  }

  function toggleActivityChecked(tripId: string, activityId: string) {
    const trip = findTripById(tripId)
    if (!trip) {
      return false
    }

    const activity = trip.activities.find((item) => item.id === activityId)
    if (!activity) {
      return false
    }

    activity.checked = !activity.checked
    return true
  }

  return {
    trips,
    hasTrips,
    addTrip,
    findTripById,
    addActivity,
    toggleActivityChecked
  }
})
