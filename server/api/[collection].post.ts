import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import type { CollGrades } from "#shared/types";

const contentDir = join(process.cwd(), "content");
const publicDir = join(process.cwd(), "public");

/**
 * POST /api/:collection
 * Принимает файлы (.md или .png) в multipart/form-data.
 * Сохраняет md в content/:collection/<filename>.md, а png в public/:collection/<filename>.png.
 * Если файл уже существует — заменяет его.
 */
export default defineEventHandler(async (event) => {
  const collection = getRouterParam(
    event,
    "collection",
  ) as keyof typeof CollGrades;

  const parts = await readMultipartFormData(event);

  // Проверяем, что в запросе есть файлы .md и .png
  if (!parts) {
    throw createError({
      status: 400,
      message: "Ожидается multiparqt/form-data с файлом .md или .png",
    });
  }

  // Находим файлы .md и .png
  const file = parts.find((p) => p.filename?.endsWith(".md"));
  const image = parts.find((p) => p.filename?.endsWith(".png"));

  try {
    if (file?.filename) {
      const filePath = join(contentDir, collection, file.filename);
      await writeFile(filePath, file.data.toString("utf-8"), {
        encoding: "utf-8",
      });
    } else if (image?.filename) {
      const imagePath = join(publicDir, collection, image.filename);
      await writeFile(imagePath, image.data);
    }
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
