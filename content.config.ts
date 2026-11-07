import { defineContentConfig, defineCollection } from "@nuxt/content";
import { object, string, date } from "valibot";

export default defineContentConfig({
  collections: {
    a: defineCollection({
      type: "page",
      source: "a/*.md",
      schema: object({
        title: string(),
        birthday: date(),
        description: string(),
        date: date(),
      }),
    }),
    b: defineCollection({
      type: "page",
      source: "b/*.md",
      schema: object({
        title: string(),
        birthday: date(),
        description: string(),
        date: date(),
      }),
    }),
    plus: defineCollection({
      type: "page",
      source: "plus/*.md",
      schema: object({
        title: string(),
        birthday: date(),
        description: string(),
        date: date(),
      }),
    }),
    archive: defineCollection({
      type: "page",
      source: "archive/*.md",
      schema: object({
        title: string(),
        birthday: date(),
        description: string(),
        date: date(),
      }),
    }),
  },
});
