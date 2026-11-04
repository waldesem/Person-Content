import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import type { Collections } from "@nuxt/content";

const contentDir = join(process.cwd(), "content");
const publicDir = join(process.cwd(), "public");

/**
 * POST /api/:collection
 * Принимает файлы (.md и .png) в multipart/form-data.
 * Сохраняет md в content/:collection/<filename>.md и png в public/:collection/<filename>.png
 * под именем из загруженных файлов.
 * Если файл уже существует — заменяет его.
 */
export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, "collection") as keyof Collections;

  const parts = await readMultipartFormData(event);

  // Проверяем, что в запросе есть файлы .md и .png
  if (!parts) {
    throw createError({
      status: 400,
      message: "Ожидается multipart/form-data с файлами .md и .png",
    });
  }

  // Находим файлы .md и .png
  const file = parts.find((p) => p.filename?.endsWith(".md"));
  const image = parts.find((p) => p.filename?.endsWith(".png"));

  // Проверяем, что файлы найдены
  if (!file?.filename || !image?.filename) {
    throw createError({
      status: 400,
      message: "Один или оба файла не найден в запросе",
    });
  }

  // Проверяем, что имена файлов без расширения совпадают
  if (
    file.filename.replace(/\.md$/, "") !== image.filename.replace(/\.png$/, "")
  ) {
    throw createError({
      status: 400,
      message: "Имена файлов не совпадают",
    });
  }

  // Сохраняем файлы в content и public
  const filePath = join(contentDir, collection, file.filename);
  const imagePath = join(publicDir, collection, image.filename);

  try {
    await writeFile(filePath, file.data.toString("utf-8"), {
      encoding: "utf-8",
    });
    await writeFile(imagePath, image.data);
  } catch (error) {
    throw createError({
      status: 500,
      message: String(error),
    });
  }

  return {
    ok: true,
  };
});
