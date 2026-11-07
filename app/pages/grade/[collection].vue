<script setup lang="ts">
import ky from "ky";
import { useFileDialog } from "@vueuse/core";

const router = useRouter();

const toast = useToast();

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

const { open, onChange } = useFileDialog({
  accept: ".md",
  multiple: false,
});

onChange(async (files) => {
  if (!files || !files[0]) return;

  if (files[0].size > 1024 * 1024 || !files[0]?.name.endsWith(".md")) {
    toast.add({
      title: "Ошибка",
      color: "error",
      description: "Выберите файл md не более 1 Mb",
    });
    return;
  }

  const name = files[0]?.name.replace(/\.md$/, "");

  if (!name || !/^[a-z]+$/.test(name)) {
    toast.add({
      title: "Ошибка",
      color: "error",
      description:
        "Имя файла не должно совпадать с его расширением и должно состоять из латинских букв",
    });
    return;
  }

  const formData = new FormData();
  formData.append("file", files[0]);

  const resp = await ky.post(`/api/${collection}`, {
    body: formData,
  });

  if (resp.ok) {
    router.push(`/${collection}/${name}`);
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
        <UTooltip text="Выбрать файл .md">
          <UButton
            label="Загрузить"
            size="sm"
            variant="soft"
            color="neutral"
            @click="open()"
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
