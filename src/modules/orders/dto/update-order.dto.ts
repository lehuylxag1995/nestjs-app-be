import { OrderStatus } from '@modules/orders/enum/OrderStatus.enum';
import { IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không đúng !' })
  status: OrderStatus;
}
