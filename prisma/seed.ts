import { fakerVI } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUsers(count: number) {
  //Password hash
  const saltOrRounds = 10;
  const password = '123456';
  const hash = await bcrypt.hash(password, saltOrRounds);

  for (let index = 0; index < 10; index++) {
    await prisma.user.create({
      data: {
        address: fakerVI.location.streetAddress(),
        email: fakerVI.internet.email({ provider: 'gmail.com' }),
        name: fakerVI.person.fullName(),
        phone: fakerVI.phone.number(),
        password: hash,
        CCCD: fakerVI.string.numeric(12),
      },
    });
  }
}

async function createCategories(
  depth: number,
  maxChildren: number,
  parentId: string | null = null,
  currentDepth = 0,
) {
  if (currentDepth >= depth) return;

  const numChildren = fakerVI.number.int({ min: 1, max: maxChildren });

  for (let index = 0; index < numChildren; index++) {
    const category = await prisma.category.create({
      data: {
        name: `${fakerVI.commerce.department()} ${fakerVI.color.human()}`,
        parentId: parentId,
      },
    });

    await createCategories(depth, maxChildren, category.id, currentDepth + 1);
  }
}

async function createProductForLeafCategories(min = 2, max = 5) {
  //lấy tất cả các category
  const allCategories = await prisma.category.findMany({
    include: {
      children: true,
    },
  });

  //Lọc ra các category không có con ( leaf )
  const leafCategories = allCategories.filter(
    (category) => category.children.length === 0,
  );

  //Duyệt qua danh sách
  for (const category of leafCategories) {
    //Random số lần tạo sản phẩm
    const numberProducts = fakerVI.number.int({ min, max });

    const products: Prisma.ProductCreateManyInput[] = Array.from({
      length: numberProducts,
    }).map(() => ({
      name: fakerVI.commerce.productName(),
      description: fakerVI.commerce.productDescription(),
      price: fakerVI.commerce.price({ min: 100, max: 1000, dec: 3 }),
      categoryId: category.id,
      priceSale: 0,
      brand: fakerVI.company.name(),
    }));

    await prisma.product.createMany({
      data: products,
    });

    // console.log(
    //   `🛒 Tạo ${numberProducts} sản phẩm cho category "${category.name}"`,
    // );
  }
}

async function createProductVariantForProducts(min = 1, max = 4) {
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

async function createProductImageForProducts(min = 3, max = 5) {
  const allProducts = await prisma.product.findMany();

  for (const product of allProducts) {
    const numImages = fakerVI.number.int({ min, max });

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
      };
    });

    await prisma.image.createMany({
      data: images,
    });
  }
}

async function main() {
  await createUsers(10);
  console.log('✅ Seed User');
  await createCategories(3, 3); //cây tối đa 3 tầng, mỗi node có tối đa 3 con
  console.log('✅ Seed Categories');
  await createProductForLeafCategories();
  console.log('✅ Seed Products');
  await createProductVariantForProducts();
  console.log('✅ Seed Products Variants');
  await createProductImageForProducts();
  console.log('✅ Seed Products Image');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed lỗi:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
