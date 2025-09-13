import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { IsDecimalCustom } from 'src/common/constraint/IsDeciaml.constraint';

export class CreateOrderItemDto {
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  @IsInt({ message: 'Số lượng sản phẩm phải là kiểu số' })
  @IsNotEmpty({ message: 'Bạn chưa nhập số lượng sản phẩm' })
  quantity: number;

  @Min(0, { message: 'Giá sản phẩm tối thiểu là 0' })
  @IsDecimalCustom({
    message: 'Giá sản phẩm Không đúng định dạng decimal (13,3)',
  })
  price: number;

  @IsUUID(4, { message: 'Mã sản phẩm phải là UUID v4' })
  @IsNotEmpty({ message: 'Bạn chưa nhập mã sản phẩm' })
  productId: string;
}
