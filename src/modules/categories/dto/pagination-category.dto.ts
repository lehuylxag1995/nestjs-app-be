import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationCategoryDto {
  @Type(() => Number)
  @IsInt({ message: 'Định dạng trang phải là số nguyên' })
  @Min(1, { message: 'Trang mặc định tối thiểu là 1' })
  page: number = 1;

  @Type(() => Number)
  @IsInt({ message: 'Định dạng số lượng trang phải là số nguyên' })
  @Min(1, { message: 'Số lượng trang mặc định tối thiểu là 1' })
  pageSize: number = 5;

  @IsString({ message: 'Từ khóa phải là dạng chuõi' })
  @IsOptional()
  keyword?: string;
}
