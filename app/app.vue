<script setup lang="ts">
type ThemeMode = 'light' | 'dark'

const theme = useCookie<ThemeMode>('roteiro_theme', {
  default: () => 'light',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax'
})

const isDark = computed(() => theme.value === 'dark')

useHead(() => ({
  htmlAttrs: {
    class: isDark.value ? 'dark' : undefined
  }
}))

function toggleTheme() {
  if (process.client) {
    const root = document.documentElement
    root.classList.add('theme-switching')
    window.setTimeout(() => {
      root.classList.remove('theme-switching')
    }, 350)
  }

  theme.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--text)]">
    <VitePwaManifest />
    <NuxtRouteAnnouncer />
    <button
      class="fixed left-4 bottom-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-sm active:scale-90 transition-transform"
      :aria-label="isDark ? 'Ativar tema claro' : 'Ativar tema escuro'"
      @click="toggleTheme"
    >
      <Transition name="fade-rotate" mode="out-in">
        <Icon 
          :key="isDark ? 'sun' : 'moon'" 
          :name="isDark ? 'ph:sun-bold' : 'ph:moon-bold'" 
          class="h-5 w-5"
        />
      </Transition>
    </button>
    <NuxtPage />
  </div>
</template>
