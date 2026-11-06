import { object, string, date } from "valibot";
import type { PageCollections } from "@nuxt/content";
import type { SelectItem } from "@nuxt/ui";

export const CollGrades = {
  plus: "Грейд A+" as const,
  a: "Грейд A" as const,
  b: "Грейд B" as const,
  archive: "Архивный" as const,
} as Record<keyof PageCollections, string>;

export const CollSchema = object({
  title: string(),
  description: string(),
  date: date(),
});

export type SelectGrade = SelectItem & {
  label: (typeof CollGrades)[keyof typeof CollGrades];
  value: keyof typeof CollGrades;
};
