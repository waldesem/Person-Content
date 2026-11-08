import { join } from "node:path";
import { writeFile } from "node:fs/promises";

const contentDir = join(process.cwd(), "content");

/**
 * POST /api/:collection
 * Принимает файл .md в multipart/form-data.
 * Сохраняет в content/:collection/<filename>.md
 * Если файл уже существует — возвращает ошибку.
 */
export default defineEventHandler(async (event) => {
  const collection = getRouterParam(
    event,
    "collection",
  ) as keyof typeof CollGrades;

  const parts = await readMultipartFormData(event);

  // Проверяем, что в запросе есть файлы
  if (!parts) {
    throw createError({
      status: 400,
      message: "Ожидается multiparqt/form-data",
    });
  }

  const file = parts.find((p) => p.filename?.endsWith(".md"));
  if (file && file.filename) {
    try {
      const filePath = join(contentDir, collection, file.filename);
      await writeFile(filePath, file.data.toString("utf-8"), {
        encoding: "utf-8",
        flag: "wx",
      });
    } catch (error) {
      throw createError({
        status: 500,
        message: String(error),
      });
    }
  } else {
    throw createError({
      status: 500,
      message: "File name error",
    });
  }

  return {
    ok: true,
  };
});
