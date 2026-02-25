<script setup lang="ts">
const authStore = useAuthStore()
const loginValue = ref('')
const passValue = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

authStore.syncFromCookie()
if (authStore.isAuthenticated) {
  await navigateTo('/')
}

async function submit() {
  errorMessage.value = ''
  isSubmitting.value = true

  const ok = authStore.login({
    login: loginValue.value,
    pass: passValue.value
  })

  isSubmitting.value = false

  if (!ok) {
    errorMessage.value = 'Credenciais invalidas. Tente novamente.'
    return
  }

  await navigateTo('/')
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center p-4">
    <section class="w-full max-w-sm rounded-2xl bg-[var(--surface)] p-6 shadow-sm ring-1 ring-[var(--border)]">
      <header class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-[var(--text)]">Roteiro.ai</h1>
        <p class="mt-1 text-sm text-[var(--text)]/70">Acesse sua conta para gerenciar viagens</p>
      </header>

      <form v-auto-animate class="space-y-4" @submit.prevent="submit">
        <label class="block space-y-1">
          <span class="text-sm font-medium text-[var(--text)]">Login</span>
          <input
            v-model="loginValue"
            type="text"
            autocomplete="username"
            class="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
            placeholder="seu login"
            required
          >
        </label>

        <label class="block space-y-1">
          <span class="text-sm font-medium text-[var(--text)]">Senha</span>
          <input
            v-model="passValue"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
            placeholder="sua senha"
            required
          >
        </label>

        <p v-if="errorMessage" class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Entrar
        </button>
      </form>
    </section>
  </main>
</template>
