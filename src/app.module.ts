import { PrismaModule } from '@modules/prisma/prisma.module';
import { ImagesModule } from '@modules/upload/images/images.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';

import { ProductVariantsModule } from './modules/product-variants/product-variants.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    ProductsModule,
    ImagesModule,
    ProductVariantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
