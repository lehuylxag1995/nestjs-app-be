import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariantsService } from './product-variants.service';

@Controller('product')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post(':productId/variant')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() createProductVariantDto: CreateProductVariantDto,
  ) {
    return await this.productVariantsService.create(
      productId,
      createProductVariantDto,
    );
  }

  @Get('/variant/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productVariantsService.findOne(id);
  }

  @Patch(':productId/variant/:id')
  async update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    return await this.productVariantsService.update(
      productId,
      id,
      updateProductVariantDto,
    );
  }

  @Delete('/variant/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.productVariantsService.remove(id);
  }
}
