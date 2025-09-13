import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { IsDecimalCustom } from 'src/common/constraint/IsDeciaml.constraint';

export class CreateProductDto {
  @IsString({ message: 'Tên sản phẩm phải là định dạng chuỗi' })
  @IsNotEmpty({ message: 'Bạn chưa nhập tên sản phẩm' })
  name: string;

  @IsString({ message: 'Mô tả sản phẩm phải là dạng chuỗi' })
  @IsOptional()
  description: string;

  @Min(0, { message: 'Giá sản phẩm tối thiểu là 0' })
  @IsDecimalCustom({ message: 'Giá sản phẩm không đúng định dạng' })
  @IsNotEmpty({ message: 'Bạn chưa nhập giá sản phẩm' })
  price: number;

  @Min(0, { message: 'Giá giảm sản phẩm tối thiểu là 0' })
  @IsDecimalCustom({ message: 'Giá giảm sản phẩm không đúng định dạng' })
  @IsOptional()
  priceSale: number;

  @IsString({ message: 'Tên thương hiệu phải là dạng chuỗi' })
  @IsOptional()
  brand: string;

  @IsUUID(4, { message: 'CategoryId phải là UUID v4' })
  @IsOptional()
  categoryId: string;

  @IsBoolean({ message: 'Trạng thái phải là kiểu true/false' })
  @IsOptional()
  published: boolean;
}
