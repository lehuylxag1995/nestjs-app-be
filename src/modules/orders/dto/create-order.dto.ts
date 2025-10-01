import { IsDecimalCustom } from '@Constraints/IsDeciaml.constraint';
import { OrderStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID(4, { message: 'UserId phải là UUIDv4' })
  @IsNotEmpty({ message: 'Bạn chưa nhập UserId' })
  userId: string;

  @Transform(({ value }) => (value as string).toUpperCase())
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsDecimalCustom({
    message: 'Tổng tiền phải thanh toán không đúng định dạng',
  })
  @IsOptional()
  total?: number;

  // @ValidateNested({ each: true }) // validate từng item trong mảng
  // @Type(() => CreateOrderItemDto) // giúp transform từng item thành đúng class
  // items: CreateOrderItemDto[];
}
