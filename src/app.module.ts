import { PrismaModule } from '@modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
