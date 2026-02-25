export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  auth.syncFromCookie()

  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})
