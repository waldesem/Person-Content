<script setup lang="ts">
import ky from "ky";
import type { CollGrades, SelectGrade } from "#shared/types";

const router = useRouter();

const toast = useToast();

// определяем получение параметров роута через пропсы
definePageMeta({ props: true });

// получаем параметры роута черех пропсы
const { collection, name } = defineProps<{
  collection: keyof typeof CollGrades;
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
    statusMessage: "Страница не найдена",
    fatal: true,
  });
}

useHeadSafe({ title: data.value?.title || "Страница не найдена" });

const items = ref<SelectGrade[]>([
  {
    label: "Грейд A+",
    value: "plus",
  },
  {
    label: "Грейд A",
    value: "a",
  },
  {
    label: "Грейд B",
    value: "b",
  },
  {
    label: "Архивный",
    value: "archive",
  },
]);

const item = shallowRef(collection);

async function replaceDest() {
  if (item.value === collection) {
    return;
  }
  if (!confirm("Вы действительно хотите изменить грейд?")) {
    item.value = collection;
    return;
  }

  const resp = await ky.post(`/api/${collection}/${name}`, {
    json: { item: item.value },
  });
  if (resp.ok) {
    router.push("/grade/" + item.value);
    toast.add({
      title: "Успех",
      color: "success",
      description: "Страница перенесена в другую категорию",
    });
  } else {
    toast.add({
      title: "Ошибка",
      color: "error",
      description: resp.statusText,
    });
  }
}
</script>

<template>
  <UContainer>
    <UPage v-if="data" class="py-8">
      <img
        :src="`/${collection}/${name}.png`"
        width="360"
        height="auto"
        alt=""
      />
      <div class="relative">
        <USelect
          v-model="item"
          :items="items"
          class="absolute top-3 right-10 w-auto"
          placeholder="Перенести в категорию"
          variant="soft"
          @change="replaceDest"
        />
      </div>
      <ContentRenderer class="pt-2" :value="data" />
      <template #right>
        <UContentToc title="Содержание" :links="data.body.toc?.links" />
      </template>
      <NuxtTime :datetime="data?.date ?? Date()" locale="ru-RU" />
    </UPage>
  </UContainer>
</template>
