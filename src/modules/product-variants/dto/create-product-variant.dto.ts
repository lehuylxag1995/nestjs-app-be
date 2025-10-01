import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsUUID('4')
  @IsNotEmpty({ message: 'Bạn chưa nhập productId' })
  productId: string;

  @IsString({ message: 'mã định danh (sku) phải là dạng chuỗi' })
  @IsNotEmpty({ message: 'Bạn chưa tạo mã định danh (sku)' })
  sku: string;

  @IsIn(['M', 'L', 'XL', 'XXL', 'XXXL'], {
    message: 'Kích thước không phù hợp',
  })
  @IsString({ message: 'Kích thước phải là dạng chuỗi' })
  @IsNotEmpty({ message: 'Bạn chưa nhập kích thước sản phẩm' })
  size: string;

  @IsString({ message: 'Màu sắc phải là dạng chuỗi' })
  @IsNotEmpty({ message: 'Bạn chưa nhập màu sắc sản phẩm !' })
  color: string;

  @IsBoolean({ message: 'Xuất bản phải là dạng true/false' })
  @IsOptional()
  published?: boolean;
}
