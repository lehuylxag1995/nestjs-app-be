import { fakerVI } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Tạo biến thể theo sản phẩm
export async function createProductVariantForProducts(min, max) {
  const allProduct = await prisma.product.findMany();

  for (const product of allProduct) {
    const numImages = fakerVI.number.int({ min, max });

    const productVariants: Prisma.ProductVariantCreateManyInput[] = Array.from({
      length: numImages,
    }).map(() => ({
      productId: product.id,
      size: fakerVI.string.fromCharacters(['M', 'XL', 'XXL', 'XXXL']),
      sku: fakerVI.string.alpha({ length: { min: 5, max: 10 } }), // 'HcVrCf'
      color: fakerVI.color.human(),
    }));

    await prisma.productVariant.createMany({
      data: productVariants,
    });
  }
}
