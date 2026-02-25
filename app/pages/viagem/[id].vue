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
const selectedDate = ref('')

const tripId = computed(() =>
  Array.isArray(route.params.id) ? route.params.id[0] || '' : String(route.params.id || '')
)
const trip = computed(() => travelStore.findTripById(tripId.value))

const tripDays = computed(() => {
  if (!trip.value) {
    return []
  }

  const start = new Date(trip.value.startDate)
  const end = new Date(trip.value.endDate)
  const days: { index: number; date: string }[] = []

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return days
  }

  let cursor = new Date(start)
  let index = 1
  while (cursor <= end) {
    days.push({
      index,
      date: cursor.toISOString().slice(0, 10)
    })
    cursor.setDate(cursor.getDate() + 1)
    index += 1
  }

  return days
})

const selectedDayLabel = computed(() => {
  const day = tripDays.value.find((entry) => entry.date === selectedDate.value)
  return day ? `Dia ${day.index}` : ''
})

const selectedDayActivities = computed(() => {
  if (!trip.value || !selectedDate.value) {
    return []
  }

  return trip.value.activities.filter((activity) => activity.date === selectedDate.value)
})

watch(
  tripDays,
  (days) => {
    if (!days.length) {
      selectedDate.value = ''
      return
    }

    const alreadyExists = days.some((entry) => entry.date === selectedDate.value)
    if (!alreadyExists) {
      selectedDate.value = days[0].date
    }
  },
  { immediate: true }
)

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
    time: activityTime.value,
    date: selectedDate.value || trip.value.startDate
  })

  closeModal()
}

function toggleActivityCheck(activityId: string) {
  if (!trip.value) {
    return
  }

  travelStore.toggleActivityChecked(trip.value.id, activityId)
}

const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})
</script>

<template>
  <main class="mx-auto min-h-screen w-full max-w-2xl p-4 pb-24">
    <header v-if="trip" class="mb-6">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--text)]/80">
        <Icon name="ph:arrow-left-bold" />
        Voltar
      </NuxtLink>
      <h1 class="mt-3 text-2xl font-bold text-[var(--text)]">{{ trip?.name }}</h1>
      <p class="mt-1 text-sm text-[var(--text)]/70">
        {{ formatter.format(new Date(trip.startDate)) }} - {{ formatter.format(new Date(trip.endDate)) }}
      </p>
    </header>

    <section v-if="trip" class="space-y-4">
      <div>
        <h2 class="text-lg font-semibold text-[var(--text)]">Dias do roteiro</h2>
        <div v-auto-animate class="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          <button
            v-for="day in tripDays"
            :key="day.date"
            type="button"
            class="rounded-xl border px-3 py-3 text-center text-sm font-semibold transition"
            :class="
              selectedDate === day.date
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
            "
            @click="selectedDate = day.date"
          >
            Dia {{ day.index }}
          </button>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-[var(--text)]">
          Atividades {{ selectedDayLabel ? `- ${selectedDayLabel}` : '' }}
        </h2>
      </div>
      <Transition name="day-swap" mode="out-in">
        <div
          :key="selectedDate || 'empty-day'"
          class="space-y-2"
        >
          <div v-if="selectedDayActivities.length" v-auto-animate class="space-y-2">
            <article
              v-for="activity in selectedDayActivities"
              :key="activity.id"
              class="rounded-2xl p-4 shadow-sm ring-1 transition-all duration-300"
              :class="
                activity.checked
                  ? 'bg-emerald-50 ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-700'
                  : 'bg-[var(--surface)] ring-[var(--border)]'
              "
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p
                    class="font-medium text-[var(--text)] transition-all duration-300"
                    :class="activity.checked ? 'line-through opacity-70' : ''"
                  >
                    {{ activity.title }}
                  </p>
                  <p class="text-sm text-[var(--text)]/70">{{ activity.time }}</p>
                </div>
                <button
                  type="button"
                  class="check-button inline-flex h-9 w-9 items-center justify-center rounded-full border transition"
                  :class="
                    activity.checked
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
                  "
                  :aria-label="activity.checked ? 'Desmarcar atividade' : 'Marcar atividade como concluida'"
                  @click="toggleActivityCheck(activity.id)"
                >
                  <Transition name="check-pop" mode="out-in">
                    <Icon
                      :key="activity.checked ? 'checked' : 'unchecked'"
                      :name="activity.checked ? 'ph:check-bold' : 'ph:circle'"
                      class="h-4 w-4"
                    />
                  </Transition>
                </button>
              </div>
            </article>
          </div>
          <div
            v-else
            class="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center text-sm text-[var(--text)]/70"
          >
            Nenhuma atividade neste dia. Use o botao + para adicionar.
          </div>
        </div>
      </Transition>
    </section>
    <section
      v-else
      class="mt-10 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center"
    >
      <Icon name="ph:map-pin" class="mx-auto text-4xl text-[var(--accent)]" />
      <h1 class="mt-3 text-xl font-semibold text-[var(--text)]">Viagem nao encontrada</h1>
      <p class="mt-1 text-sm text-[var(--text)]/70">Essa viagem pode ter sido removida ou nao existe mais.</p>
      <NuxtLink to="/" class="mt-5 inline-flex rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
        Voltar para inicio
      </NuxtLink>
    </section>

    <button
      v-if="trip"
      class="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg"
      aria-label="Nova atividade"
      @click="showModal = true"
    >
      <Icon name="ph:plus-bold" class="text-xl" />
    </button>

    <div
      v-if="showModal && trip"
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
