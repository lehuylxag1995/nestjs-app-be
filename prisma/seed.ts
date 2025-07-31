import { fakerVI } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
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
        name: fakerVI.commerce.department() + ' ' + fakerVI.word.adjective(),
        parentId: parentId,
      },
    });

    await createCategories(depth, maxChildren, category.id, currentDepth + 1);
  }
}

async function main() {
  await createUsers(10);
  console.log('✅ Seed User');
  await createCategories(3, 3); //cây tối đa 3 tầng, mỗi node có tối đa 3 con
  console.log('✅ Seed Categories');
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
