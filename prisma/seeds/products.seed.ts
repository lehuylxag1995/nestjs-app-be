import { fakerVI } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Tạo sản phẩm theo danh mục
export async function createProductForLeafCategories(min, max) {
  //lấy tất cả các category
  const allCategories = await prisma.category.findMany({
    include: {
      Childrens: true,
    },
  });

  //Lọc ra các category không có con ( leaf )
  const leafCategories = allCategories.filter(
    (category) => category.Childrens.length === 0,
  );

  //Duyệt qua danh sách
  for (const category of leafCategories) {
    //Random số lần tạo sản phẩm theo danh mục
    const numberProducts = fakerVI.number.int({ min, max });

    const products: Prisma.ProductCreateManyInput[] = Array.from({
      length: numberProducts,
    }).map(() => ({
      name: `${fakerVI.commerce.productName()} ${fakerVI.string.alphanumeric(5)}`,
      description: fakerVI.commerce.productDescription(),
      published: fakerVI.datatype.boolean(0.9),
      categoryId: category.id,
      brand: fakerVI.company.name(),
    }));

    await prisma.product.createMany({
      data: products,
    });
  }
}
