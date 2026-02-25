import { readTripsFromFile } from '../utils/trips-db'

export default defineEventHandler(async () => {
  const trips = await readTripsFromFile()
  return { trips }
})
