export default defineNuxtPlugin(async () => {
  const RESET_KEY = 'roteiro_sw_reset_v1'

  if (sessionStorage.getItem(RESET_KEY)) {
    return
  }

  if (!('serviceWorker' in navigator)) {
    return
  }

  const registrations = await navigator.serviceWorker.getRegistrations()
  if (!registrations.length) {
    return
  }

  sessionStorage.setItem(RESET_KEY, '1')

  await Promise.all(registrations.map((registration) => registration.unregister()))

  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }

  window.location.reload()
})
