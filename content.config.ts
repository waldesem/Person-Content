import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    a: defineCollection({
      type: "page",
      source: "a/*.md",
    }),
    b: defineCollection({
      type: "page",
      source: "b/*.md",
    }),
    plus: defineCollection({
      type: "page",
      source: "plus/*.md",
    }),
  },
});
