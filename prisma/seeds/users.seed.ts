import { fakerVI } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

//Tạo tài khoản người dùng
export async function createUserByRole(count: number, roleId: string) {
  for (let index = 0; index < count; index++) {
    //Password hash
    const saltOrRounds = 10;
    const password = '123123aA!';
    const hash = await bcrypt.hash(password, saltOrRounds);
    const name = `${fakerVI.person.fullName()}_${fakerVI.string.alphanumeric(5)}`;
    await prisma.user.create({
      data: {
        address: fakerVI.location.streetAddress(),
        email: fakerVI.internet.email({ provider: 'gmail.com' }),
        name,
        phone: fakerVI.phone.number(),
        username: name + fakerVI.string.alphanumeric(5),
        password: hash,
        CCCD: fakerVI.string.numeric(12),
        isActive: true,
        roleId,
      },
    });
  }
}
