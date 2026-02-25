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

type TripsResponse = {
  trips: Trip[]
}

export const useTravelStore = defineStore('travel', () => {
  const trips = ref<Trip[]>([])
  const hasLoaded = ref(false)
  const isLoading = ref(false)
  let loadPromise: Promise<void> | null = null

  const hasTrips = computed(() => trips.value.length > 0)

  async function loadTrips(force = false) {
    if (hasLoaded.value && !force) {
      return
    }
    if (loadPromise) {
      return loadPromise
    }

    loadPromise = (async () => {
      isLoading.value = true
      try {
        const response = await $fetch<TripsResponse>('/api/trips')
        trips.value = Array.isArray(response.trips) ? response.trips : []
      } catch (error) {
        console.error('Falha ao carregar trips:', error)
      } finally {
        hasLoaded.value = true
        isLoading.value = false
        loadPromise = null
      }
    })()

    return loadPromise
  }

  async function persistTrips() {
    try {
      await $fetch('/api/trips', {
        method: 'PUT',
        body: { trips: trips.value }
      })
    } catch (error) {
      console.error('Falha ao salvar trips:', error)
    }
  }

  function addTrip(payload: NewTripInput) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    trips.value.unshift({
      id,
      name: payload.name.trim(),
      startDate: payload.startDate,
      endDate: payload.endDate,
      activities: []
    })
    void persistTrips()
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

    void persistTrips()
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
    void persistTrips()
    return true
  }

  return {
    trips,
    hasTrips,
    hasLoaded,
    isLoading,
    loadTrips,
    addTrip,
    findTripById,
    addActivity,
    toggleActivityChecked
  }
})
