<script setup lang="ts">
import ky from "ky";
import { useFileDialog } from "@vueuse/core";
import type { Collections } from "@nuxt/content";
import { Grades } from "#shared/types";

const toast = useToast();

// определяем получение параметра роута через пропс и валидируем его
definePageMeta({
  props: true,
  validate: (route) => {
    const collParam = route.params.collection as string;
    return collParam in Grades;
  },
});

// получаем параметры роута черех пропсы
const { collection } = defineProps<{ collection: keyof Collections }>();

// формируем имя грейда
const graid = computed(() => Grades[collection]);

// заголовок страницы
useHeadSafe({ title: graid.value });

// получаем список карточек из коллекции
const { data } = await useAsyncData(() => queryCollection(collection).all());

const { open, onChange } = useFileDialog({
  accept: ".md,.png",
});

onChange(async (files) => {
  if (!files || files.length !== 2) {
    toast.add({
      title: "Ошибка",
      color: "error",
      description: "Выберите файл md и png  для загрузки",
    });
    return;
  }

  const formData = new FormData();
  Array.from(files).forEach((file) => {
    if (file.size > 1024 * 1024 || !file.size) {
      toast.add({
        title: "Ошибка",
        color: "error",
        description: "Файлы должны быть не более 1 Мб",
      });
      return;
    }
    formData.append("files[]", file);
  });

  const resp = await ky.post(`/api/${collection}`, {
    body: formData,
  });
  if (resp.ok) {
    toast.add({
      title: "Успех",
      color: "success",
      description: "Файлы успешно загружены",
    });
  } else {
    toast.add({
      title: "Ошибка",
      color: "error",
      description: resp.statusText,
    });
  }
});
</script>

<template>
  <UContainer>
    <UPageHeader :title="graid">
      <template #links>
        <UButton
          icon="i-lucide-upload"
          variant="ghost"
          color="neutral"
          @click="open()"
        />
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
