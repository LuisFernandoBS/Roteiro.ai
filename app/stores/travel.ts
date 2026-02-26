import { defineStore } from 'pinia'

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

type DbTripRow = {
  id: string
  name: string | null
  content: {
    name?: string
    startDate?: string
    endDate?: string
    activities?: TripActivity[]
  } | null
  created_at?: string | null
}

export const useTravelStore = defineStore('travel', () => {
  const supabase = useSupabaseClient()

  const trips = ref<Trip[]>([])
  const hasLoaded = ref(false)
  const isLoading = ref(false)
  let loadPromise: Promise<void> | null = null

  const hasTrips = computed(() => trips.value.length > 0)

  function normalizeActivities(input: unknown): TripActivity[] {
    if (!Array.isArray(input)) {
      return []
    }

    return input
      .filter((item) => typeof item === 'object' && item !== null)
      .map((item) => {
        const value = item as Record<string, unknown>
        return {
          id: String(value.id || ''),
          title: String(value.title || ''),
          time: String(value.time || ''),
          date: String(value.date || ''),
          checked: Boolean(value.checked)
        }
      })
      .filter((item) => item.id && item.title)
  }

  function mapRowToTrip(row: DbTripRow): Trip {
    const content = row.content || {}
    return {
      id: String(row.id),
      name: String(row.name || content.name || ''),
      startDate: String(content.startDate || ''),
      endDate: String(content.endDate || ''),
      activities: normalizeActivities(content.activities)
    }
  }

  async function loadTrips(force = false) {
    if (hasLoaded.value && !force) {
      return
    }
    if (loadPromise) {
      return loadPromise
    }

    loadPromise = (async () => {
      isLoading.value = true
      const { data, error } = await supabase
        .from('trips')
        .select('id, name, content, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar trips:', error.message)
      } else {
        const rows = (data || []) as DbTripRow[]
        trips.value = rows.map(mapRowToTrip)
      }

      hasLoaded.value = true
      isLoading.value = false
      loadPromise = null
    })()

    return loadPromise
  }

  function findTripById(id: string) {
    return trips.value.find((trip) => trip.id === id)
  }

  async function persistTrip(trip: Trip) {
    const payload = {
      id: trip.id,
      name: trip.name,
      content: {
        name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        activities: trip.activities
      }
    }

    const { error } = await supabase.from('trips').upsert(payload)
    if (error) {
      console.error('Erro ao salvar trip:', error.message)
      return false
    }

    return true
  }

  function addTrip(payload: NewTripInput) {
    const id = crypto.randomUUID()
    const trip: Trip = {
      id,
      name: payload.name.trim(),
      startDate: payload.startDate,
      endDate: payload.endDate,
      activities: []
    }

    trips.value.unshift(trip)
    void persistTrip(trip)

    return id
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

    void persistTrip(trip)
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
    void persistTrip(trip)
    return true
  }

  return {
    trips,
    hasTrips,
    hasLoaded,
    isLoading,
    loadTrips,
    findTripById,
    addTrip,
    addActivity,
    toggleActivityChecked
  }
})
