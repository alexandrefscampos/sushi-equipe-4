import { Controller, Get, Query, Param } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuItemDto } from './dto/menu-item.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getMenu(@Query('category') category?: string): MenuItemDto[] {
    if (category !== undefined) {
      return this.menuService.findByCategory(category);
    }
    return this.menuService.findAvailable();
  }

  @Get('all')
  getAllMenu(): MenuItemDto[] {
    return this.menuService.findAll();
  }

  @Get(':id')
  getMenuItem(@Param('id') id: string): MenuItemDto | undefined {
    return this.menuService.findById(+id);
  }
}
