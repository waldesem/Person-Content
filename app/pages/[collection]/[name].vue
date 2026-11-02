<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();

// получаем грейд из роута
const coll = computed(() => route.params.collection as keyof Collections);

// получаем имя из роута
const name = computed(() => route.params.name as string);

// получаем данные из коллекции
const { data } = await useAsyncData(`${coll.value}-${name.value}`, () =>
  queryCollection(coll.value).path(`/${coll.value}/${name.value}`).first(),
);

// проверяем, существует ли страница
if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Страница не найдена",
    fatal: true,
  });
}

useHeadSafe({ title: data.value?.title || "Страница не найдена" });
</script>

<template>
  <UContainer>
    <UPage class="pt-8">
      <ContentRenderer v-if="data" :value="data" />
      <template #right>
        <UContentToc title="Содержание" :links="data?.body?.toc?.links" />
      </template>
    </UPage>
  </UContainer>
</template>
