<script setup lang="ts">
import type { Collections } from "@nuxt/content";
import type { SelectItem } from "@nuxt/ui";

const router = useRouter();

const toast = useToast();

// определяем получение параметров роута через пропсы
definePageMeta({ props: true });

// получаем параметры роута черех пропсы
const { collection, name } = defineProps<{
  collection: keyof Collections;
  name: string;
}>();

// получаем данные из коллекции
const { data } = await useAsyncData(`${collection}-${name}`, () =>
  queryCollection(collection).path(`/${collection}/${name}`).first(),
);

// проверяем, существует ли страница
if (!data.value) {
  toast.add({
    title: "Ошибка",
    description: "Страница не найдена",
  });
  throw createError({
    statusCode: 404,
    statusMessage: "Страница не найдена",
    fatal: true,
  });
}

useHeadSafe({ title: data.value?.title || "Страница не найдена" });

const items = ref<SelectItem[]>([
  {
    label: "A+",
    value: "plus",
  },
  {
    label: "A",
    value: "a",
  },
  {
    label: "B",
    value: "b",
  },
  {
    label: "Archive",
    value: "archive",
  },
]);

const item = ref(collection);

function rename() {
  if (item.value === collection) return;
  if (!confirm("Вы дейтсвительно хотите изменить грейд?")) return;

  fetch(`/api/${collection}/${name}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item: item.value,
    }),
  })
    .then((res) => {
      if (res.ok) {
        router.push("/grade/" + item.value);
        toast.add({
          title: "Успех",
          description: "Страница перенесена в другую категорию",
        });
      }
    })
    .catch((err) => {
      toast.add({
        title: "Ошибка",
        description: err.message,
      });
    });
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
          class="absolute top-0 right-10 w-auto"
          placeholder="Перенести в категорию"
          variant="soft"
          @change="rename"
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
