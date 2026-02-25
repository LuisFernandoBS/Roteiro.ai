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
  theme.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--text)]">
    <NuxtRouteAnnouncer />
    <button
      class="fixed right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-sm"
      :aria-label="isDark ? 'Ativar tema claro' : 'Ativar tema escuro'"
      @click="toggleTheme"
    >
      <Icon :name="isDark ? 'ph:sun-bold' : 'ph:moon-bold'" />
    </button>
    <NuxtPage />
  </div>
</template>
