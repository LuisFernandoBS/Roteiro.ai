export type TripActivity = {
  id: string
  title: string
  time: string
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
}

export const useTravelStore = defineStore('travel', () => {
  const trips = ref<Trip[]>([
    {
      id: 'rio-2026',
      name: 'Rio de Janeiro',
      startDate: '2026-03-20',
      endDate: '2026-03-25',
      activities: [
        { id: 'a-1', title: 'Visita ao Museu do Amanha', time: '10:00' },
        { id: 'a-2', title: 'Jantar no Centro', time: '20:00' }
      ]
    }
  ])

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
      time: payload.time
    })
    return true
  }

  return {
    trips,
    hasTrips,
    addTrip,
    findTripById,
    addActivity
  }
})
