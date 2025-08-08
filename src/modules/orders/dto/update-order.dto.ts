import { IsInt, IsUUID } from 'class-validator';
import { IsDecimalCustom } from 'src/constraint/IsDeciaml.constraint';

export class UpdateOrderDto {
  @IsUUID(4, { message: 'product Id phải là uuid v4' })
  productId: string;

  @IsInt({ message: 'Số lượng phải là số nguyên' })
  quantity: number;

  @IsDecimalCustom({ message: 'Giá tiền không đúng định dạng 13,3' })
  price: number;
}
