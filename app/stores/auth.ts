type AuthUser = {
  name: string
  login: string
}

type AuthCredentials = {
  login: string
  pass: string
}

type RuntimeAuthUser = {
  login: string
  pass: string
}

const AUTH_COOKIE_KEY = 'roteiro_auth_user'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const authCookie = useCookie<AuthUser | null>(AUTH_COOKIE_KEY, {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })

  const user = ref<AuthUser | null>(authCookie.value)
  const isAuthenticated = computed(() => !!user.value)

  const validUsers = computed<RuntimeAuthUser[]>(() => {
    const users = config.public.authUsers as RuntimeAuthUser[] | undefined
    return Array.isArray(users) ? users.filter((entry) => !!entry.login && !!entry.pass) : []
  })

  function syncFromCookie() {
    user.value = authCookie.value
  }

  function login(credentials: AuthCredentials) {
    const normalizedLogin = credentials.login.trim()

    const matched = validUsers.value.find(
      (entry) => entry.login === normalizedLogin && entry.pass === credentials.pass
    )

    if (!matched) {
      return false
    }

    user.value = {
      login: normalizedLogin,
      name: normalizedLogin
    }
    authCookie.value = user.value
    return true
  }

  function logout() {
    user.value = null
    authCookie.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    syncFromCookie
  }
})
