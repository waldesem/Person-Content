import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    a: defineCollection({
      type: "page",
      source: "a/*.md",
      schema: CollSchema,
    }),
    b: defineCollection({
      type: "page",
      source: "b/*.md",
      schema: CollSchema,
    }),
    plus: defineCollection({
      type: "page",
      source: "plus/*.md",
      schema: CollSchema,
    }),
    archive: defineCollection({
      type: "page",
      source: "archive/*.md",
      schema: CollSchema,
    }),
  },
});
