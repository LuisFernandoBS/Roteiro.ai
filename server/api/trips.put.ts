import { writeTripsToFile } from '../utils/trips-db'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  const body = await readBody<{ trips?: unknown }>(event)

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Body invalido'
    })
  }

  const trips = await writeTripsToFile(body.trips)
  return { ok: true, trips }
})
