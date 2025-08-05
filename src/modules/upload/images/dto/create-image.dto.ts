import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateImageDto {
  originalName: string; // Tên ảnh gốc khi upload
  filename: string; // Tên file được lưu trên server, đảm bảo duy nhất
  path: string; // Đường dẫn lưu trữ vd: /uploads/images/user/d5a7e8f2-abc1-42f7.png
  mimetype: string; // Kiểu MIME của file
  size: number; // Byte

  @IsUUID(4, { message: 'Product Id phải là UUIDv4' })
  @IsOptional()
  productId?: string;

  @IsUUID(4, { message: 'User Id phải là UUIDv4' })
  @IsOptional()
  userId?: string;

  @IsBoolean({ message: 'Xuất bản phải là dạng true/false' })
  @IsOptional()
  published?: boolean;
}
