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
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemsService } from './order-items.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return await this.orderItemsService.createOrderItem(createOrderItemDto);
  }

  @Get()
  async findAll() {
    return await this.orderItemsService.findAllOrderItem();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.orderItemsService.findOneOrderItem(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return await this.orderItemsService.updateOrderItem(id, updateOrderItemDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.orderItemsService.removeOrderItem(id);
  }
}
