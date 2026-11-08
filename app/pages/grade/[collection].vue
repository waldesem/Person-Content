<script setup lang="ts">
// определяем получение параметра роута через пропс и валидируем его
definePageMeta({
  props: true,
  validate: (route) => {
    const collParam = route.params.collection as string;
    return collParam in CollGrades;
  },
});

// получаем параметры роута черех пропсы
const { collection } = defineProps<{ collection: keyof typeof CollGrades }>();

// формируем имя грейда
const graid = computed(() => CollGrades[collection]);

const field = shallowRef("date" as "date" | "title");
const direction = shallowRef("ASC" as "ASC" | "DESC");

// заголовок страницы
useHeadSafe({ title: graid.value });

// получаем список навигации из коллекции
const { data, refresh } = await useAsyncData(() =>
  queryCollection(collection).order(field.value, direction.value).all(),
);
</script>

<template>
  <UContainer>
    <UPageHeader :title="graid">
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
