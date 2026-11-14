<script setup lang="ts">
import { grades } from "../index.vue";

// определяем получение параметра роута через пропс и валидируем его
definePageMeta({
  props: true,
  validate: (route) => {
    const param = route.params.collection as string;
    return param in grades;
  },
});

// получаем параметры роута черех пропсы
const { collection } = defineProps<{ collection: keyof typeof grades }>();

const field = shallowRef<"date" | "title">("date");
const direction = shallowRef<"ASC" | "DESC">("ASC");

// получаем список навигации из коллекции
const { data, refresh } = await useAsyncData(() =>
  queryCollection(collection).order(field.value, direction.value).all(),
);
</script>

<template>
  <UContainer>
    <UPageHeader :title="grades[collection]">
      <template #links>
        <UTooltip text="Упорядочить">
          <USelect
            v-model="field"
            class="w-auto"
            size="sm"
            :items="[
              { value: 'date', label: 'По дате' },
              { value: 'title', label: 'По имени' },
            ]"
            variant="soft"
            @change="refresh()"
          />
        </UTooltip>
        <UTooltip text="Сортировать">
          <USelect
            v-model="direction"
            class="w-auto"
            size="sm"
            :items="[
              { value: 'ASC', label: 'По убыванию' },
              { value: 'DESC', label: 'По возрастанию' },
            ]"
            variant="soft"
            @change="refresh()"
          />
        </UTooltip>
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
          alt="Нет фото"
        />
      </UPageCard>
    </UPageGrid>
  </UContainer>
</template>
