import { CreateOrderItemDto } from '@modules/orders/dto/create-order-item.dto';
import { UpdateOrderItemDto } from '@modules/orders/dto/update-order-item.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.createOrder(
      createOrderDto.userId,
      createOrderDto.items,
    );
  }

  @Post(':orderId/item')
  async addOrderItem(
    @Param('orderId') orderId: string,
    @Body() dto: CreateOrderItemDto,
  ) {
    return await this.ordersService.createItemToExistingOrder(orderId, dto);
  }

  @Patch(':orderId/item/:orderItemId')
  async editOrderItem(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('orderItemId', ParseUUIDPipe) orderItemId: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return await this.ordersService.editItemToExistingOrder(
      orderId,
      orderItemId,
      dto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ordersService.remove(id);
  }

  @Delete(':orderId/item/:orderItemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('orderItemId', ParseUUIDPipe) orderItemId: string,
  ) {
    return await this.ordersService.removeItemToExistingOrder(
      orderId,
      orderItemId,
    );
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ordersService.findOne(id);
  }
}
