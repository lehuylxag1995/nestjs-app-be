import { fakerVI } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

//Tạo tài khoản người dùng
export async function createUsers(
  countCustomer: number,
  countStaff: number,
  countAdmin: number,
) {
  async function createUserByRole(
    count: number,
    role: 'CUSTOMER' | 'STAFF' | 'ADMIN',
  ) {
    for (let index = 0; index < count; index++) {
      //Password hash
      const saltOrRounds = 10;
      const password = '123456';
      const hash = await bcrypt.hash(password, saltOrRounds);

      await prisma.user.create({
        data: {
          address: fakerVI.location.streetAddress(),
          email: fakerVI.internet.email({ provider: 'gmail.com' }),
          name: `${fakerVI.person.fullName()}_${fakerVI.string.alphanumeric(5)}`,
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
