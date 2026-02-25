<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const travelStore = useTravelStore()

const showModal = ref(false)
const activityTitle = ref('')
const activityTime = ref('')
const activityError = ref('')

const trip = computed(() => travelStore.findTripById(route.params.id as string))

if (!trip.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Viagem nao encontrada'
  })
}

function closeModal() {
  showModal.value = false
  activityTitle.value = ''
  activityTime.value = ''
  activityError.value = ''
}

function saveActivity() {
  activityError.value = ''

  if (!trip.value) {
    activityError.value = 'Viagem nao encontrada.'
    return
  }

  if (!activityTitle.value.trim() || !activityTime.value) {
    activityError.value = 'Preencha titulo e horario.'
    return
  }

  travelStore.addActivity(trip.value.id, {
    title: activityTitle.value,
    time: activityTime.value
  })

  closeModal()
}

const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})
</script>

<template>
  <main class="mx-auto min-h-screen w-full max-w-2xl p-4 pb-24">
    <header class="mb-6">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--text)]/80">
        <Icon name="ph:arrow-left-bold" />
        Voltar
      </NuxtLink>
      <h1 class="mt-3 text-2xl font-bold text-[var(--text)]">{{ trip?.name }}</h1>
      <p class="mt-1 text-sm text-[var(--text)]/70">
        {{ formatter.format(new Date(trip!.startDate)) }} - {{ formatter.format(new Date(trip!.endDate)) }}
      </p>
    </header>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-[var(--text)]">Atividades</h2>
      <div v-if="trip && trip.activities.length" v-auto-animate class="space-y-2">
        <article
          v-for="activity in trip.activities"
          :key="activity.id"
          class="rounded-2xl bg-[var(--surface)] p-4 shadow-sm ring-1 ring-[var(--border)]"
        >
          <p class="font-medium text-[var(--text)]">{{ activity.title }}</p>
          <p class="text-sm text-[var(--text)]/70">{{ activity.time }}</p>
        </article>
      </div>
      <div
        v-else
        class="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center text-sm text-[var(--text)]/70"
      >
        Nenhuma atividade cadastrada. Use o botao + para adicionar.
      </div>
    </section>

    <button
      class="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg"
      aria-label="Nova atividade"
      @click="showModal = true"
    >
      <Icon name="ph:plus-bold" class="text-xl" />
    </button>

    <div
      v-if="showModal"
      class="fixed inset-0 z-20 flex items-end bg-black/30 p-0 sm:items-center sm:justify-center sm:p-4"
    >
      <div
        v-auto-animate
        class="w-full rounded-t-2xl bg-[var(--surface)] p-4 shadow-xl ring-1 ring-[var(--border)] sm:max-w-md sm:rounded-2xl"
      >
        <h3 class="text-lg font-semibold text-[var(--text)]">Nova atividade</h3>

        <form class="mt-4 space-y-3" @submit.prevent="saveActivity">
          <label class="block space-y-1">
            <span class="text-sm font-medium text-[var(--text)]">Titulo</span>
            <input
              v-model="activityTitle"
              type="text"
              class="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
              placeholder="Ex: Visita ao Museu"
            >
          </label>

          <label class="block space-y-1">
            <span class="text-sm font-medium text-[var(--text)]">Horario</span>
            <input
              v-model="activityTime"
              type="time"
              class="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
            >
          </label>

          <p v-if="activityError" class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {{ activityError }}
          </p>

          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-semibold text-[var(--text)]"
              @click="closeModal"
            >
              Cancelar
            </button>
            <button type="submit" class="flex-1 rounded-xl bg-[var(--primary)] px-4 py-3 font-semibold text-white">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
