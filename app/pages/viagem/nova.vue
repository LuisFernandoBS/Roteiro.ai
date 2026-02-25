<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const travelStore = useTravelStore()
const name = ref('')
const startDate = ref('')
const endDate = ref('')
const errorMessage = ref('')

async function submit() {
  errorMessage.value = ''

  if (!name.value.trim() || !startDate.value || !endDate.value) {
    errorMessage.value = 'Preencha todos os campos.'
    return
  }

  if (new Date(endDate.value) < new Date(startDate.value)) {
    errorMessage.value = 'A data de volta deve ser igual ou posterior a data de ida.'
    return
  }

  travelStore.addTrip({
    name: name.value,
    startDate: startDate.value,
    endDate: endDate.value
  })

  await navigateTo('/')
}
</script>

<template>
  <main class="mx-auto min-h-screen w-full max-w-2xl p-4 pb-24">
    <header class="mb-6">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--text)]/80">
        <Icon name="ph:arrow-left-bold" />
        Voltar
      </NuxtLink>
      <h1 class="mt-3 text-2xl font-bold text-[var(--text)]">Nova viagem</h1>
    </header>

    <form
      v-auto-animate
      class="space-y-4 rounded-2xl bg-[var(--surface)] p-4 shadow-sm ring-1 ring-[var(--border)]"
      @submit.prevent="submit"
    >
      <label class="block space-y-1">
        <span class="text-sm font-medium text-[var(--text)]">Nome da viagem</span>
        <input
          v-model="name"
          type="text"
          placeholder="Ex: Ferias em Lisboa"
          class="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
          required
        >
      </label>

      <label class="block space-y-1">
        <span class="text-sm font-medium text-[var(--text)]">Data de ida</span>
        <input
          v-model="startDate"
          type="date"
          class="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
          required
        >
      </label>

      <label class="block space-y-1">
        <span class="text-sm font-medium text-[var(--text)]">Data de volta</span>
        <input
          v-model="endDate"
          type="date"
          class="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
          required
        >
      </label>

      <p v-if="errorMessage" class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ errorMessage }}
      </p>

      <button type="submit" class="w-full rounded-xl bg-[var(--primary)] px-4 py-3 font-semibold text-white">
        Salvar Viagem
      </button>
    </form>
  </main>
</template>
