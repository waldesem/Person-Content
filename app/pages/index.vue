<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";

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
  <UContainer>
    <UPage>
      <UPageSection
        class="pt-16"
        icon="i-lucide-user-group"
        title="Топ-менеджент Банка"
        description="Краткая биография руководителей верхнего уровня"
        :features="features"
      />
    </UPage>
  </UContainer>
</template>
