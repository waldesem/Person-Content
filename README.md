# Person Content

Контент-сайт с краткими биографиями топ-менеджмента.
Персоны разделены на грейды **А+**, **А** и **B**.
Rаждый грейд — отдельная коллекция Markdown-файлов, управляемая через [Nuxt Content](https://content.nuxt.com).

## Стек

- [Nuxt 4](https://nuxt.com) — Vue-based SSR-фреймворк
- [@nuxt/content 3](https://content.nuxt.com) — контент на Markdown с SQLite-базой
- [@nuxt/ui 4](https://ui.nuxt.com) — UI-компоненты
- [VueUse](https://vueuse.org) - набор утилит
- [Tailwind CSS 4](https://tailwindcss.com) — стилизация
- [Valibot](https://valibot.dev) - схема коллекций
- [Jimp](https://jimp-dev.github.io/jimp) - преобразование изображений
- [Ky](https://github.com/sindresorhus/ky) - HTTP-клиент
- [Bun](https://bun.sh) — пакетный менеджер и рантайм

## Структура проекта

```
├── app/
│   ├── assets/css/main.css         # Глобальные стили
│   ├── app.config.ts               # Конфигурация приложения (тема Nuxt UI)
│   ├── app.vue                     # Корневой компонент
│   └── pages/
│       ├── index.vue               # Главная: выбор грейда (А+, А, B)
│       ├── grade/[collection].vue  # Список персон грейда (collection = a | b | plus)
│       └── [collection]/[name].vue # Страница биографии конкретной персоны
├── content/
│   └── plus/                       # Коллекция «plus»: биографии грейда А+
│       └── morozova.md
├── public/
│   └── plus/                       # Фотографии персон (public/<collection>/<name>.png)
├── content.config.ts               # Определение коллекций контента (a, b, plus)
├── nuxt.config.ts                  # Конфигурация Nuxt
├── server/
│   └── api                         # Nitro-сервер
│       ├── [collection].post.ts    # добавление нового файла md в коллекцию
│       └── [collection]/
│            ├── [name].post.ts     # перемещение в другую коллекцию
│            └── [name].patch.ts    # добавление/перезапись изображения или md
└── shared/types/index.ts           # типы данных
```

## Коллекции контента

В [`content.config.ts`](content.config.ts) определены три коллекции типа `page`:

| Коллекция | Источник        | Грейд | Маршрут       |
| --------- | --------------- | ----- | ------------- |
| `plus`    | `content/plus/` | А+    | `/grade/plus` |
| `a`       | `content/a/`    | А     | `/grade/a`    |
| `b`       | `content/b/`    | B     | `/grade/b`    |

### Формат файла биографии

Каждая персона — Markdown-файл с frontmatter:

```markdown
---
title: "Фамилия Имя Отчество"
description: "Должность, короткое описание"
date: 2026-11-01
---

## Образование

- ...

## Карьера

- ...
```

Фотография персоны добавляется в `public/<collection>/<name>.png` и автоматически подставляется в карточку.

## Запуск

Требуется [Bun](https://bun.sh) (или Node.js 24+).

```bash
# Клонирование репозитория
git clone https://github.com/waldesem/Person-Content.git
cd Person-Content
# Установка зависимостей
bun install

# Режим разработки — http://localhost:3000
bun run dev
```

## Продакшен

```bash
# Сборка
bun run build

# Запуск сервера
node .output/server/index.mjs
# Listening on http://localhost:3000
```

## Добавление новой персоны

- На одной из страниц `grade` загрузите файл `<name>.md` с (`title`, `description`, `date`) и текстом биографии.
- Персона автоматически появится в списке соответствующего грейда.
- На странице `grade/<name>.md` добавьте фотографию.

## Разработка

- База контента — SQLite (переменная окружения `SQLITE_DB_LOCATION`).

## Скриншоты

<img src="screenshots/screenshot-1.png" width="100%" alt="Скриншот 1">
<img src="screenshots/screenshot-2.png" width="100%" alt="Скриншот 2">
<img src="screenshots/screenshot-3.png" width="100%" alt="Скриншот 3">
<img src="screenshots/screenshot-4.png" width="100%" alt="Скриншот 4">
