import { AuthModule } from '@modules/auth/auth.module';
import { CaslModule } from '@modules/casl/casl.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ProductVariantsModule } from '@modules/product-variants/product-variants.module';
import { ProductsModule } from '@modules/products/products.module';
import { ImagesModule } from '@modules/upload/images/images.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    ProductsModule,
    ImagesModule,
    ProductVariantsModule,
    OrdersModule,
    UsersModule,
    AuthModule,
    CaslModule,
    PermissionModule,
  ],
})
export class AppModule {}
