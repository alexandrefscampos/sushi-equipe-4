import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrdersService, OrderDto } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: Omit<OrderDto, 'id' | 'createdAt'>): Promise<OrderDto> {
    return await this.ordersService.create(body);
  }

  @Get()
  async findAll(): Promise<OrderDto[]> {
    return await this.ordersService.findAll();
  }
}
