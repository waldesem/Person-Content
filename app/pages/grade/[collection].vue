<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();

// получаем грейд из роута
const coll = computed(() => route.params.collection as keyof Collections);

// получаем список карточек из коллекции
const { data } = await useAsyncData(() => queryCollection(coll.value).all());

const titles = { plus: "А+", a: "А", b: "B" };

useHeadSafe({ title: "Грейд " + titles[coll.value] });
</script>

<template>
  <UContainer>
    <UPageHeader :title="'Грейд ' + titles[coll]" />
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
