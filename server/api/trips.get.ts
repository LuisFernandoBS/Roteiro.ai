import { readTripsFromFile } from '../utils/trips-db'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  const trips = await readTripsFromFile()
  return { trips }
})
