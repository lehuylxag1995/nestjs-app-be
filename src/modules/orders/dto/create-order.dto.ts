import { CreateOrderItemDto } from '@Modules/orders/dto/create-order-item.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @IsUUID(4, { message: 'UserId phải là UUIDv4' })
  @IsNotEmpty({ message: 'Bạn chưa nhập UserId' })
  userId: string;

  @ValidateNested({ each: true }) // validate từng item trong mảng
  @Type(() => CreateOrderItemDto) // giúp transform từng item thành đúng class
  items: CreateOrderItemDto[];
}
