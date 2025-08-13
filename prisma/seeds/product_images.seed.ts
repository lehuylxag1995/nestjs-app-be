import { fakerVI } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Tạo hình ảnh theo sản phẩm
export async function createProductImageForProducts(min, max) {
  // Nhân viên tạo
  const listUserId = await prisma.user.findMany({
    select: { id: true },
    where: { role: 'STAFF' },
  });

  const allProducts = await prisma.product.findMany();

  for (const product of allProducts) {
    const numImages = fakerVI.number.int({ min, max });
    const userId = fakerVI.helpers.arrayElement(listUserId).id;
    const images: Prisma.ImageCreateManyInput[] = Array.from({
      length: numImages,
    }).map(() => {
      const uuid = fakerVI.string.uuid();
      const filename = `${uuid}.jpg`;
      return {
        originalName: fakerVI.system.commonFileName('jpg'),
        filename: filename,
        path: `https://picsum.photos/seed/${uuid}/500/500`,
        mimetype: 'image/jpeg',
        size: fakerVI.number.int({ min: 1000, max: 20000 }),
        productId: product.id,
        userId,
      };
    });

    await prisma.image.createMany({
      data: images,
    });
  }
}
