export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", href: "/favicon.ico" }],
      htmlAttrs: { lang: "ru" },
    },

    pageTransition: { name: "page", mode: "out-in" },
  },

  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/content", "@nuxt/image"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  icon: {
    clientBundle: {
      scan: true,
    },
  },

  routeRules: {
    "/": { prerender: true },
  },

  compatibilityDate: "2026-11-09",

  content: {
    database: {
      type: "sqlite",
      filename: ":memory:",
    },
  },
});
