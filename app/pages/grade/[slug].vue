<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();

const slug = route.params.slug as keyof Collections;

const { data } = await useAsyncData(() => queryCollection(slug).all());

const titles = { plus: "А+", a: "А", b: "B" };
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="'Грейд ' + titles[slug]"
      :ui="{ root: 'border-none py-12' }"
    />
    <UPage>
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
          <img :src="card.path + '.png'" alt="" />
        </UPageCard>
      </UPageGrid>
    </UPage>
  </UContainer>
</template>

<style>
.img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}
</style>
