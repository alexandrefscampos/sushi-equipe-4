import { Injectable } from '@nestjs/common';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  private filePath = join(process.cwd(), 'data', 'orders.json');

  private async readOrders(): Promise<OrderDto[]> {
    try {
      const data = await readFile(this.filePath, 'utf8');
      return JSON.parse(data) as OrderDto[];
    } catch {
      return [];
    }
  }

  private async saveOrders(orders: OrderDto[]): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(orders, null, 2));
  }

  async create(orderDto: Omit<OrderDto, 'id' | 'createdAt'>): Promise<OrderDto> {
    const orders = await this.readOrders();
    const nextId = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const newOrder: OrderDto = {
      id: nextId,
      createdAt: new Date().toISOString(),
      ...orderDto,
    };
    orders.push(newOrder);
    await this.saveOrders(orders);
    return newOrder;
  }

  async findAll(): Promise<OrderDto[]> {
    return await this.readOrders();
  }
}