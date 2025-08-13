import { fakerVI } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Tạo danh mục sản phẩm
export async function createCategories(
  depth: number, // Số node root
  maxChildren: number, // Số node phụ thuộc root
  parentId: string | null = null,
  currentDepth = 0,
) {
  if (currentDepth >= depth) return;

  const numChildren =
    parentId === null
      ? depth // cấp root → tạo đúng depth node
      : fakerVI.number.int({ min: 1, max: maxChildren });

  for (let index = 0; index < numChildren; index++) {
    const category = await prisma.category.create({
      data: {
        name: `${fakerVI.food.ethnicCategory()} ${fakerVI.food.fruit()} ${fakerVI.string.alphanumeric(3)}`,
        parentId: parentId,
      },
    });

    await createCategories(depth, maxChildren, category.id, currentDepth + 1);
  }
}
