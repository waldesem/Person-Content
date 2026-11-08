<script setup lang="ts">
import ky from "ky";
import { useFileDialog } from "@vueuse/core";

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
const { data, refresh } = await useAsyncData(`${collection}-${name}`, () =>
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

async function replace() {
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

const { open, onChange } = useFileDialog({
  accept: "image/*,.md",
  multiple: false,
});

onChange(async (files) => {
  if (!files || !files[0] || files[0].size > 1024 * 1024) {
    toast.add({
      title: "Ошибка",
      color: "error",
      description: "Выберите файл не более 1 Mb",
    });
    return;
  }

  if (!confirm("Содержимеое будет перезаписано!")) return;

  const formData = new FormData();
  formData.append("file", files[0]);

  const resp = await ky.patch(`/api/${collection}/${name}`, {
    body: formData,
  });

  if (resp.ok) {
    await refresh();
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
    <UPage v-if="data" class="pt-8">
      <NuxtImg
        class="rounded-xl"
        :src="`/${collection}/${name}.png`"
        width="320"
        height="auto"
        alt="Нет фото"
      />
      <UPageHeader :title="data?.title" :description="data?.description">
        <template #links>
          <UTooltip text="Перенести в категорию">
            <USelect
              v-model="item"
              :items="items"
              class="w-auto"
              variant="soft"
              @change="replace"
            />
          </UTooltip>
          <UTooltip text="Выбрать новый файл .md">
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
      <ContentRenderer :value="data" />
      <template #right>
        <UContentToc title="Содержание" :links="data.body.toc?.links" />
      </template>
      <NuxtTime :datetime="data?.date ?? Date()" locale="ru-RU" />
    </UPage>
  </UContainer>
</template>
