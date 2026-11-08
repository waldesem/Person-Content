import { Jimp } from "jimp";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import type { CollGrades } from "#shared/types";

const contentDir = join(process.cwd(), "content");
const publicDir = join(process.cwd(), "public");

/**
 * PATCH /api/:collection
 * Принимает файлы (image/.) в multipart/form-data.
 * Сохраняет в png в public/:collection/<filename>.png.
 * Если файл уже существует — заменяет его.
 */
export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name") as string;
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
      const filePath = join(contentDir, collection, `${name}.md`);
      await writeFile(filePath, file.data.toString("utf-8"), {
        encoding: "utf-8",
      });
    } catch (error) {
      throw createError({
        status: 500,
        message: String(error),
      });
    }
  } else {
    try {
      const imagePart = parts.find((p) => p.filename);
      console.log(imagePart?.filename);
      if (imagePart?.data) {
        console.log("if (imagePart?.data) {");
        const image = await Jimp.fromBuffer(imagePart.data);
        const imagePath = join(publicDir, collection, `${name}.png`);
        await image.write(imagePath as `${string}.${string}`);
      } else {
        throw createError({
          status: 500,
          message: "Image data errpr",
        });
      }
    } catch (error) {
      throw createError({
        status: 500,
        message: String(error),
      });
    }
  }
  return {
    ok: true,
  };
});
