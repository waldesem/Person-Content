<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";

// Главная страница с грейдами
const features = ref<PageFeatureProps[]>([
  {
    title: "Грейд А+",
    description: "Топ-менеджмент категории A+",
    icon: "i-lucide-a-large-small",
    to: "/grade/plus",
  },
  {
    title: "Грейд А",
    description: "Топ-менеджмент категории А",
    icon: "i-lucide-letter-a",
    to: "/grade/a",
  },
  {
    title: "Грейд В",
    description: "Топ-менеджмент категории B",
    icon: "i-lucide-letter-b",
    to: "/grade/b",
  },
]);
</script>

<template>
  <UContainer class="my-[20vh]">
    <UPageSection
      icon="i-lucide-user-group"
      title="Топ-менеджент"
      description="Краткая биография руководителей"
      :features="features"
    />
  </UContainer>
</template>
