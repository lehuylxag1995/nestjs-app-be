import { AppConfigModule } from '@Configs/app.config';
import { AuthModule } from '@Modules/auth/auth.module';
import { CaslModule } from '@Modules/casl/casl.module';
import { CategoriesModule } from '@Modules/categories/categories.module';
import { MailModule } from '@Modules/mail/mail.module';
import { OrdersModule } from '@Modules/orders/orders.module';
import { OtpModule } from '@Modules/otp/otp.module';
import { PermissionModule } from '@Modules/permission/permission.module';
import { PrismaModule } from '@Modules/prisma/prisma.module';
import { ProductVariantsModule } from '@Modules/product-variants/product-variants.module';
import { ProductsModule } from '@Modules/products/products.module';
import { RolesModule } from '@Modules/roles/roles.module';
import { TokenModule } from '@Modules/token/token.module';
import { ImagesModule } from '@Modules/upload/images/images.module';
import { UsersModule } from '@Modules/users/users.module';
import { Module } from '@nestjs/common';

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
    TokenModule,
    MailModule,
    OtpModule,
    ...AppConfigModule,
  ],
})
export class AppModule {}
