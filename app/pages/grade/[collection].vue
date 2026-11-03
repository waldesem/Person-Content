<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const titles: Record<keyof Collections, string> = {
  plus: "А+",
  a: "А",
  b: "B",
};

// определяем получение параметра роута через пропс и валидируем его
definePageMeta({
  props: true,
  validate: (route) => {
    const collParam = route.params.collection as string;
    return collParam in titles;
  },
});

// получаем параметры роута черех пропсы
const { collection } = defineProps<{ collection: keyof Collections }>();

// формируем имя грейда
const graid = computed(() => {
  return "Грейд " + titles[collection];
});

// заголовок страницы
useHeadSafe({ title: graid.value });

// получаем список карточек из коллекции
const { data } = await useAsyncData(() => queryCollection(collection).all());
</script>

<template>
  <UContainer>
    <UPageHeader :title="graid" />
    <UPageGrid>
      <UPageCard
        v-for="(card, index) in data"
        :key="index"
        :title="card.title"
        :description="card.description"
        :to="card.path"
        orientation="horizontal"
        target="_blank"
        reverse
      >
        <NuxtImg
          class="rounded-xl"
          :src="card.path + '.png'"
          loading="lazy"
          quality="60"
          alt="image"
        />
      </UPageCard>
    </UPageGrid>
  </UContainer>
</template>
