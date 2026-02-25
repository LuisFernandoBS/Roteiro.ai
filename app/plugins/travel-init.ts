export default defineNuxtPlugin(async () => {
  const travelStore = useTravelStore()
  await travelStore.loadTrips()
})
