<script setup>
useHead({
  title: "ТОП-менеджмент",
  description: "Приложение для просмотра управленческого состава организации",
});

// используем useSearchCollection для поиска по содержимому
const { search, status, init } = useSearchCollection(["a", "b", "plus"], {
  immediate: false,
});

// используем useContentSearch для открытия поиска
const { open } = useContentSearch();

// открываем поиск при изменении open
watch(open, (value) => {
  if (value && status.value === "idle") {
    init();
  }
});
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" title="Главная страница">
          <div
            v-once
            class="inline-flex items-center text-2xl font-bold space-x-1"
          >
            <div class="text-blue-600">Staff</div>
            <div class="text-red-600">Sec</div>
          </div>
        </NuxtLink>
      </template>

      <template #right>
        <UContentSearchButton />
        <ClientOnly>
          <LazyUContentSearch :search="search" :search-status="status" />
        </ClientOnly>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter />
  </UApp>
</template>
