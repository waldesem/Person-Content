<script setup lang="ts">
import type { Collections } from "@nuxt/content";
import { useFileDialog } from "@vueuse/core";

const titles: Record<keyof Collections, string> = {
  plus: "А+",
  a: "А",
  b: "B",
  archive: "Архивный",
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

const { open, reset, onCancel, onChange } = useFileDialog({
  accept: ".md,.png",
});

onChange((files) => {
  if (!files || files.length !== 2) return;

  const formData = new FormData();
  Array.from(files).forEach((file) => {
    if (file.size > 1024 * 1024 || !file.size) return;
    formData.append("files[]", file);
  });

  fetch(`/api/${collection}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (res.ok) {
        reset();
      }
    })
    .catch((err) => {
      console.error(err);
      reset();
    });
});

onCancel(() => {
  reset();
});
</script>

<template>
  <UContainer>
    <UPageHeader :title="graid">
      <template #links>
        <UButton icon="i-lucide-upload" variant="ghost" @click="open()" />
      </template>
    </UPageHeader>
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
          quality="60"
          alt="image"
        />
      </UPageCard>
    </UPageGrid>
  </UContainer>
</template>
