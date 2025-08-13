import { fakerVI } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createSupplier(count: number) {
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
