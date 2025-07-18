import { Injectable } from '@nestjs/common';
import { MenuItemDto } from './dto/menu-item.dto';
import * as menuData from '../data/menu.json';

@Injectable()
export class MenuService {
  private menuItems: MenuItemDto[] = menuData as MenuItemDto[];

  findAll(): MenuItemDto[] {
    return this.menuItems;
  }

  findAvailable(): MenuItemDto[] {
    return this.menuItems.filter((item) => item.available);
  }

  findByCategory(category: string): MenuItemDto[] {
    return this.menuItems.filter(
      (item) => item.category === category && item.available,
    );
  }

  findById(id: number): MenuItemDto | undefined {
    return this.menuItems.find((item) => item.id === id);
  }
}
