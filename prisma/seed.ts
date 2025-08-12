import { fakerVI } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

//Tạo tài khoản người dùng
async function createUsers(
  countCustomer: number,
  countStaff: number,
  countAdmin: number,
) {
  //Password hash
  const saltOrRounds = 10;
  const password = '123456';
  const hash = await bcrypt.hash(password, saltOrRounds);

  async function createUserByRole(
    count: number,
    role: 'CUSTOMER' | 'STAFF' | 'ADMIN',
  ) {
    for (let index = 0; index < count; index++) {
      await prisma.user.create({
        data: {
          address: fakerVI.location.streetAddress(),
          email: fakerVI.internet.email({ provider: 'gmail.com' }),
          name: fakerVI.person.fullName(),
          phone: fakerVI.phone.number(),
          password: hash,
          CCCD: fakerVI.string.numeric(12),
          isActive: fakerVI.datatype.boolean({ probability: 0.9 }),
          role,
        },
      });
    }
  }

  await createUserByRole(countCustomer, 'CUSTOMER');
  await createUserByRole(countStaff, 'STAFF');
  await createUserByRole(countAdmin, 'ADMIN');
}

//Tạo danh mục sản phẩm
async function createCategories(
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

//Tạo sản phẩm theo danh mục
async function createProductForLeafCategories(min, max) {
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

//Tạo biến thể theo sản phẩm
async function createProductVariantForProducts(min, max) {
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

//Tạo hình ảnh theo sản phẩm
async function createProductImageForProducts(min, max) {
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

//Tạo nhà cung cấp
async function createSupplier(count: number) {
  for (let i = 0; i < count; i++) {
    await prisma.supplier.create({
      data: {
        name: fakerVI.company.name(),
        address: `${fakerVI.location.streetAddress()} ${fakerVI.location.city()} ${fakerVI.location.country()}`,
        email: fakerVI.internet.email({
          provider: '@gmail.com',
          firstName: `NCC_${fakerVI.string.alphanumeric(5)}_`,
        }),
        phone: fakerVI.phone.number({ style: 'human' }),
        contactPerson: fakerVI.person.fullName(),
        bankName: fakerVI.finance.accountName(),
        bankAccount: fakerVI.finance.accountNumber(),
        taxId: fakerVI.string.numeric(10),
      },
    });
  }
}

//Tạo quy tắc định giá
async function createPricingRule(percent: number) {
  //Tạo mặc định tất cả sản phẩm 20% lợi nhuận
  await prisma.pricingRule.create({
    data: {
      categoryId: null,
      customerId: null,
      productVariantId: null,
      margin: percent,
    },
  });
}

//Tạo đơn nhập hàng
async function createPurcharsOrderBySupplier(count: number) {
  //Nhà cung cấp
  const listSupplierId = await prisma.supplier.findMany({
    select: { id: true },
  });
  const supplierIds = listSupplierId.map((s) => s.id);

  // Nhân viên tạo
  const listUserId = await prisma.user.findMany({
    select: { id: true },
    where: { role: 'STAFF' },
  });
  const UserIds = listUserId.map((u) => u.id);

  for (let i = 0; i < count; i++) {
    const randomSupplierId = fakerVI.helpers.arrayElement(supplierIds);
    const ramdomUserId = fakerVI.helpers.arrayElement(UserIds);
    // Tạo ngày đặt hàng trong 30 ngày tới
    const dateWithin30Days = fakerVI.date.soon({ days: 30 }).toISOString();

    await prisma.purcharsOrder.create({
      data: {
        supplierId: randomSupplierId,
        createdById: ramdomUserId,
        orderDate: dateWithin30Days,
        expectedDeliveryDate: dateWithin30Days,
        receivedById: null,
        status: 'DRAFT',
        total: 0,
        note: 'Hệ thống tạo demo',
      },
    });
  }
}

//Tạo chi tiết đơn nhập hàng
async function createPurcharsOrderItemsByPurcharsOrder(
  minProduct: number,
  maxProduct: number,
) {
  //Lấy danh sách đơn nhập hàng
  const purcharsOrders = await prisma.purcharsOrder.findMany({
    select: { id: true },
  });

  //Lấy danh sách products
  const products = await prisma.product.findMany({
    select: {
      id: true,
    },
  });

  // Tạo chi tiết đơn hàng theo đơn hàng
  for (let purcharsOrder of purcharsOrders) {
    // Random sản phẩm trong đơn
    const getNumberProduct = fakerVI.number.int({
      min: minProduct,
      max: maxProduct,
    });
    const productsInOrderItem = fakerVI.helpers.arrayElements(
      products,
      getNumberProduct,
    );

    for (const product of productsInOrderItem) {
      const variants = await prisma.productVariant.findMany({
        where: { productId: product.id },
        select: { id: true },
      });

      // Random số lượng đang có thuộc sản phẩm
      const variantsInOrder = fakerVI.helpers.arrayElements(
        variants,
        fakerVI.number.int({ min: 1, max: variants.length }),
      );

      // Thêm từng variant vào đơn hàng
      for (const variant of variantsInOrder) {
        const quantity = Number(fakerVI.number.int({ min: 20, max: 100 }));
        const taxRate = Number(fakerVI.number.int({ min: 10, max: 15 }));
        const unitCost = Number(
          fakerVI.commerce.price({ min: 100, max: 500, dec: 3 }),
        );
        const totalCost = quantity * unitCost * (taxRate / 100 + 1);
        await prisma.purcharsOrderItem.create({
          data: {
            purcharsOrderId: purcharsOrder.id,
            productId: product.id,
            variantId: variant.id,
            quantity,
            unitCost,
            taxRate,
            totalCost,
          },
        });
      }
    }

    //Cập nhật total PurcharsOrder
    const sumTotal = await prisma.purcharsOrderItem.aggregate({
      where: { purcharsOrderId: purcharsOrder.id },
      _sum: { totalCost: true },
    });

    await prisma.purcharsOrder.update({
      where: { id: purcharsOrder.id },
      data: { total: sumTotal._sum.totalCost || 0 },
    });
  }
}

//Tạo phiếu nhập 
async function createInventoryTransactions(){
  await prisma.inventoryTransaction.create({
    data:{
      type:'IMPORT',
      
    }
  })
}

// async function createOrder(count: number) {
//   //Random thông tin khách hàng
//   const listUser = await prisma.user.findMany({
//     where: { role: 'CUSTOMER' },
//     select: { id: true },
//   });

//   //Tạo đơn hàng
//   for (let i = 0; i < count; i++) {
//     const userId = fakerVI.helpers.arrayElement(listUser).id;
//     await prisma.order.create({
//       data: {
//         status: 'PENDING',
//         total: 0,
//         userId,
//       },
//     });
//   }
// }

// async function createOrderItemByOrder(min: number, max: number) {
//   await prisma.$transaction(async (prisma) => {
//     //Lấy danh sách đơn hàng
//     const listOrders = await prisma.order.findMany({ select: { id: true } });

//     // Lấy danh sách sản phẩm
//     const listProduct = await prisma.product.findMany({
//       select: {
//         id: true,
//         Variants: {
//           select: {
//             id: true,
//             listedPrice: true,
//           },
//         },
//       },
//     });

//     // Tạo chi tiết đơn hàng
//     for (const order of listOrders) {
//       let total = 0;

//       const data: Prisma.OrderItemCreateManyInput[] = [];

//       const numberRandom = fakerVI.number.int({ min, max });
//       for (let i = 0; i < numberRandom; i++) {
//         const product = fakerVI.helpers.arrayElement(listProduct);
//         const variants = fakerVI.helpers.shuffle(product.Variants);
//         for (let i = 0; i < variants.length; i++) {
//           const variant = variants[i].id;
//           const quantity = fakerVI.number.int({ min: 1, max: 5 });
//           const listedPrice = Number(product.listedPrice);
//           const unitCost = Number(variant.PurcharsOrderItems[0]?.unitCost ?? 0);
//           const totalListedPrice = quantity * listedPrice;
//           const totalCostPrice = quantity * unitCost;

//           await prisma.orderItem.create({
//             data: {
//               orderId: order.id,
//               productId: product.id,
//               variantId: variant,
//               quantity,
//               listedPrice,
//               totalListedPrice,
//               costPrice: unitCost,
//               totalCostPrice,
//             },
//           });

//           total += listedPrice * quantity;
//         }
//       }

//       // Cập nhật tổng tiền
//       await prisma.order.update({
//         where: { id: order.id },
//         data: { total },
//       });
//     }
//   });
// }

async function main() {
  await createUsers(50, 5, 2);
  console.log('✅ Seed User');
  await createCategories(3, 3); //cây tối đa 3 tầng, mỗi node có tối đa 3 con
  console.log('✅ Seed Categories');
  await createProductForLeafCategories(3, 10);
  console.log('✅ Seed Products');
  await createProductVariantForProducts(1, 4);
  console.log('✅ Seed Products Variants');
  await createProductImageForProducts(3, 5);
  console.log('✅ Seed Products Image');
  await createSupplier(20);
  console.log('✅ Seed Supplier');
  await createPurcharsOrderBySupplier(20);
  console.log('✅ Seed Purchars Order');
  await createPurcharsOrderItemsByPurcharsOrder(1, 5);
  console.log('✅ Seed Purchars Order Item');
  await createPricingRule(20);
  console.log('✅ Seed Pricing Rule');
  // await createOrder(20);
  // console.log('✅ Seed Order');
  // await createOrderItemByOrder(3, 10);
  // console.log('✅ Seed Order Items');
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
