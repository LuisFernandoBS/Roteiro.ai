<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const travelStore = useTravelStore()

const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})

function formatPeriod(startDate: string, endDate: string) {
  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`
}

function logout() {
  authStore.logout()
  return navigateTo('/login')
}
</script>

<template>
  <main class="mx-auto flex min-h-screen w-full max-w-2xl flex-col p-4 pb-24">
    <header class="mb-6 flex items-center justify-between">
      <div>
        <p class="text-sm text-[var(--text)]/70">Bem-vindo</p>
        <h1 class="text-2xl font-bold">{{ authStore.user?.name || 'Usuario' }}</h1>
      </div>
      <button
        class="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)]"
        @click="logout"
      >
        Sair
      </button>
    </header>

    <section
      v-if="!travelStore.hasTrips"
      class="mt-12 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center"
    >
      <Icon name="ph:map-pin" class="mx-auto text-4xl text-[var(--accent)]" />
      <h2 class="mt-3 text-lg font-semibold text-[var(--text)]">Nenhuma viagem cadastrada</h2>
      <p class="mt-1 text-sm text-[var(--text)]/70">Toque no botao + para criar seu primeiro roteiro.</p>
    </section>

    <section v-else v-auto-animate class="space-y-3">
      <article
        v-for="trip in travelStore.trips"
        :key="trip.id"
        class="rounded-2xl bg-[var(--surface)] p-4 shadow-sm ring-1 ring-[var(--border)]"
      >
        <h2 class="text-lg font-semibold text-[var(--text)]">{{ trip.name }}</h2>
        <p class="mt-1 text-sm text-[var(--text)]/70">{{ formatPeriod(trip.startDate, trip.endDate) }}</p>
        <NuxtLink
          :to="`/viagem/${trip.id}`"
          class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Icon name="ph:map-pin" />
          Ver Roteiro
        </NuxtLink>
      </article>
    </section>

    <NuxtLink
      to="/viagem/nova"
      class="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg"
      aria-label="Nova viagem"
    >
      <Icon name="ph:plus-bold" class="text-xl" />
    </NuxtLink>
  </main>
</template>
