<script lang="ts">
import type { Collections } from "@nuxt/content";
import type { ButtonProps, PageFeatureProps } from "@nuxt/ui";

export const grades: { [K in keyof Collections]: string } = {
  a: "Грейд A" as const,
  b: "Грейд B" as const,
  plus: "Грейд A+" as const,
  archive: "Архивный" as const,
};

interface GradesPageFeatureProps extends PageFeatureProps {
  title: (typeof grades)[keyof typeof grades];
}
</script>

<script setup lang="ts">
// Главная страница с грейдами
const features = ref<GradesPageFeatureProps[]>([
  {
    title: grades.plus,
    description: "Менеджмент категории " + grades.plus,
    icon: "i-lucide-a-large-small",
    to: "/grade/plus",
  },
  {
    title: grades.a,
    description: "Менеджмент категории " + grades.a,
    icon: "i-lucide-letter-a",
    to: "/grade/a",
  },
  {
    title: grades.b,
    description: "Менеджмент категории " + grades.b,
    icon: "i-lucide-letter-b",
    to: "/grade/b",
  },
]);

const links = ref<ButtonProps[]>([
  {
    label: grades.archive,
    to: "/grade/archive",
    color: "neutral",
    variant: "subtle",
    trailingIcon: "i-lucide-arrow-right",
  },
]);
</script>

<template>
  <UContainer class="flex items-center h-screen">
    <UPageSection
      icon="i-lucide-user-group"
      title="Топ-менеджент"
      description="Краткая биография руководителей"
      :features="features"
      :links="links"
    />
  </UContainer>
</template>
