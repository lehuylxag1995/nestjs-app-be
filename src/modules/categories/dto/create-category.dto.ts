import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Tên danh mục phải là dạng chuỗi' })
  @IsNotEmpty({ message: 'Bạn chưa nhập tên danh mục' })
  name: string;

  @IsUUID(4, { message: 'ID danh mục phụ thuộc phải là UUID v4' })
  @IsOptional()
  parentId?: string;

  @IsBoolean({ message: 'Phải là giá trị true/false' })
  @IsOptional()
  published: boolean;
}
