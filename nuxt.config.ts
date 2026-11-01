export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", href: "/favicon.ico" }],
      htmlAttrs: {
        lang: "ru",
      },
    },

    pageTransition: { name: "page", mode: "out-in" },
  },

  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/content"],

  devtools: {
    enabled: true,
  },

  build: {
    analyze: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/": { prerender: true },
  },

  compatibilityDate: "2026-11-01",

  content: {
    database: {
      type: "sqlite",
      filename: "SQLITE_DB_LOCATION",
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
