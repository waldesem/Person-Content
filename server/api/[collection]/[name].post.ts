import { join } from "node:path";
import fs from "node:fs/promises";

const contentDir = join(process.cwd(), "content");
const publicDir = join(process.cwd(), "public");

/**
 * POST /api/:collection/<filename>
 * Получает в теле имя новой коллекции и переносит файлы .md и .png в новую коллекцию
 */
export default defineEventHandler(async (event) => {
  const collection = getRouterParam(
    event,
    "collection",
  ) as keyof typeof CollGrades;
  const name = getRouterParam(event, "name") as string;

  const body = await readBody(event);
  const item = body.item as keyof typeof CollGrades;

  const filePath = join(contentDir, collection, `${name}.md`);
  const imagePath = join(publicDir, collection, `${name}.png`);

  try {
    await fs.rename(filePath, join(contentDir, item, `${name}.md`));
    await fs.rename(imagePath, join(publicDir, item, `${name}.png`));
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: String(error),
    });
  }
  return {
    ok: true,
  };
});
