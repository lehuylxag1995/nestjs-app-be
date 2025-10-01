import { CreateOrderDto } from '@Modules/orders/dto/create-order.dto';
import { UpdateOrderDto } from '@Modules/orders/dto/update-order.dto';
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
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateOrderDto) {
    return await this.ordersService.createOrder(data);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.ordersService.deleteOrder(id);
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAllOrder();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.ordersService.findOneOrder(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateOrderDto,
  ) {
    return await this.ordersService.updateOrder(id, data);
  }
}
