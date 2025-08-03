import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Bạn chưa nhập tên danh mục' })
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID(4, { message: 'ID danh mục phụ thuộc phải là UUID v4' })
  parentId?: string | null;

  @IsOptional()
  @IsBoolean({ message: 'Phải là giá trị true/false' })
  published: boolean;
}
