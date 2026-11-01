<script setup>
useHead({
  title: "ТОП-менеджеры",
  description: "Приложение для просмотра управленческого состава организации",
});
const { search, status, init } = useSearchCollection(["a", "b", "plus"], {
  immediate: false,
});

const { open } = useContentSearch();

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
        <NuxtLink to="/">
          <div
            v-once
            class="inline-flex items-center text-xl font-bold space-x-2"
          >
            <div class="text-blue-600">КАДРОВАЯ</div>
            <div class="text-red-600">СЛУЖБА</div>
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

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
