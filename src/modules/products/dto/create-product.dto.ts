import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Tên sản phẩm phải là định dạng chuỗi' })
  @IsNotEmpty({ message: 'Bạn chưa nhập tên sản phẩm' })
  name: string;

  @IsString({ message: 'Mô tả sản phẩm phải là dạng chuỗi' })
  @IsOptional()
  description: string;

  @IsString({ message: 'Tên thương hiệu phải là dạng chuỗi' })
  @IsOptional()
  brand: string;

  @IsUUID(4, { message: 'CategoryId phải là UUID v4' })
  @IsOptional()
  categoryId: string;

  @IsBoolean({ message: 'Trạng thái phải là kiểu true/false' })
  @IsOptional()
  published?: boolean;
}
