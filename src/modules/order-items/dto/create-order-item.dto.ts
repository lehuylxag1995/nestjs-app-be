import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';
import { IsDecimalCustom } from 'src/common/constraint/IsDeciaml.constraint';

export class CreateOrderItemDto {
  @IsUUID(4, { message: 'Mã đơn hàng phải là UUID v4' })
  @IsNotEmpty({ message: 'Bạn chưa nhập mã đơn hàng' })
  orderId: string;

  @IsUUID(4, { message: 'Mã sản phẩm phải là UUID v4' })
  @IsNotEmpty({ message: 'Bạn chưa nhập mã sản phẩm' })
  productId: string;

  @IsUUID(4, { message: 'Mã biến thể sản phẩm phải là UUID v4' })
  @IsNotEmpty({ message: 'Bạn chưa nhập mã biến thể sản phẩm' })
  variantId: string;

  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  @IsInt({ message: 'Số lượng sản phẩm phải là kiểu số' })
  @IsNotEmpty({ message: 'Bạn chưa nhập số lượng sản phẩm' })
  quantity: number;

  @Min(0, { message: 'Giá sản phẩm tối thiểu là 0' })
  @IsDecimalCustom({
    message: 'Giá sản phẩm không đúng định dạng decimal (13,3)',
  })
  listedPrice: number;

  @Min(0, { message: 'Thành tiền tối thiểu là 0' })
  @IsDecimalCustom({
    message: 'Giá thành tiền không đúng định dạng decimal (13,3)',
  })
  @IsOptional()
  totalListedPrice?: number;
}
