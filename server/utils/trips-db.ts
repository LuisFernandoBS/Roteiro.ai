import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'

type TripActivity = {
  id: string
  title: string
  time: string
  date: string
  checked?: boolean
}

type Trip = {
  id: string
  name: string
  startDate: string
  endDate: string
  activities: TripActivity[]
}

const DATA_DIR = resolve(process.cwd(), 'server', 'data')
const DATA_FILE = resolve(DATA_DIR, 'trips.json')

function normalizeTrips(input: unknown): Trip[] {
  if (!Array.isArray(input)) {
    return []
  }

  return input
    .filter((trip) => typeof trip === 'object' && trip !== null)
    .map((trip) => {
      const value = trip as Record<string, unknown>
      const activities = Array.isArray(value.activities) ? value.activities : []

      return {
        id: String(value.id || ''),
        name: String(value.name || ''),
        startDate: String(value.startDate || ''),
        endDate: String(value.endDate || ''),
        activities: activities
          .filter((activity) => typeof activity === 'object' && activity !== null)
          .map((activity) => {
            const item = activity as Record<string, unknown>
            return {
              id: String(item.id || ''),
              title: String(item.title || ''),
              time: String(item.time || ''),
              date: String(item.date || ''),
              checked: Boolean(item.checked)
            }
          })
      }
    })
    .filter((trip) => trip.id && trip.name)
}

export async function readTripsFromFile() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return normalizeTrips(JSON.parse(raw))
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') {
      await fs.mkdir(DATA_DIR, { recursive: true })
      await fs.writeFile(DATA_FILE, '[]', 'utf-8')
      return []
    }
    throw error
  }
}

export async function writeTripsToFile(input: unknown) {
  const trips = normalizeTrips(input)
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, `${JSON.stringify(trips, null, 2)}\n`, 'utf-8')
  return trips
}
