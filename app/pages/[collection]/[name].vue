<script setup lang="ts">
import type { grades } from "../index.vue";

// определяем получение параметров роута через пропсы
definePageMeta({ props: true });

// получаем параметры роута черех пропсы
const { collection, name } = defineProps<{
  collection: keyof typeof grades;
  name: string;
}>();

// получаем данные из коллекции
const { data } = await useAsyncData(`${collection}-${name}`, () =>
  queryCollection(collection).path(`/${collection}/${name}`).first(),
);

// проверяем, существует ли страница
if (!data.value) {
  throw createError({
    statusCode: 404,
    message: "Страница не найдена",
    fatal: true,
  });
}
</script>

<template>
  <UContainer>
    <UPage v-if="data" class="pt-8">
      <NuxtImg
        class="rounded-xl"
        :src="`/${collection}/${name}.png`"
        width="320"
        height="auto"
        alt="Нет фото"
      />
      <UPageHeader :title="data?.title" :description="data?.description" />
      <ContentRenderer :value="data" />
      <template #right>
        <UContentToc title="Содержание" :links="data.body.toc?.links" />
      </template>
      <NuxtTime :datetime="data?.date ?? Date()" locale="ru-RU" />
    </UPage>
  </UContainer>
</template>
