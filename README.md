# Person Content

Контент-сайт с краткими биографиями топ-менеджмента.
Персоны разделены на грейды **А+**, **А** и **B**.
Rаждый грейд — отдельная коллекция Markdown-файлов, управляемая через [Nuxt Content](https://content.nuxt.com).

## Стек

- [Nuxt 4](https://nuxt.com) — фреймворк (SSR + prerender главной страницы)
- [@nuxt/content 3](https://content.nuxt.com) — контент на Markdown с SQLite-базой
- [@nuxt/ui 4](https://ui.nuxt.com) — компоненты
- [Tailwind CSS 4](https://tailwindcss.com) — стилизация
- [Valibot](https://valibot.dev) - схемы коллекций
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
│       └── 1.morozova.md
├── public/
│   └── plus/                       # Фотографии персон (public/<collection>/<name>.png)
├── content.config.ts               # Определение коллекций контента (a, b, plus)
└── nuxt.config.ts                  # Конфигурация Nuxt
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

<img src="/plus/<name>.png" width="200" height="auto" alt="">

# Фамилия Имя Отчество

## Образование

- ...

## Карьера

- ...
```

Фотография персоны кладётся в `public/<collection>/<name>.png` и автоматически подставляется в карточку на странице грейда.

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

Предпросмотр собранной версии: `bun run preview`.

Главная страница (`/`) пререндерится при сборке (см. `routeRules` в [`nuxt.config.ts`](nuxt.config.ts)).

## Добавление новой персоны

1. Создайте файл `content/<collection>/<номер>.<name>.md` с frontmatter (`title`, `description`, `date`) и текстом биографии.
2. Добавьте фотографию `public/<collection>/<name>.png`.
3. Персона автоматически появится в списке соответствующего грейда.

## Разработка

- База контента — SQLite (переменная окружения `SQLITE_DB_LOCATION`).

## Скриншоты

<img src="screenshots/screenshot-1.png" width="100%" alt="Скриншот 1">
<img src="screenshots/screenshot-2.png" width="100%" alt="Скриншот 2">
<img src="screenshots/screenshot-3.png" width="100%" alt="Скриншот 3">
