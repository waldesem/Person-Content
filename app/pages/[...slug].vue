<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();

const [coll, path] = route.params.slug as string[];

const { data } = await useAsyncData(() =>
  queryCollection(coll as keyof Collections)
    .path(`/${coll}/${path}`)
    .first(),
);
console.log(data.value);
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
