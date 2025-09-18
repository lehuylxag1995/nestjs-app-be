import { AuthModule } from '@Modules/auth/auth.module';
import { CaslModule } from '@Modules/casl/casl.module';
import { CategoriesModule } from '@Modules/categories/categories.module';
import { OrdersModule } from '@Modules/orders/orders.module';
import { PrismaModule } from '@Modules/prisma/prisma.module';
import { ProductVariantsModule } from '@Modules/product-variants/product-variants.module';
import { ProductsModule } from '@Modules/products/products.module';
import { ImagesModule } from '@Modules/upload/images/images.module';
import { UsersModule } from '@Modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RolesModule } from './modules/roles/roles.module';
import { TokenModule } from './modules/token/token.module';

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
    RolesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TokenModule,
    MailModule,
  ],
})
export class AppModule {}
