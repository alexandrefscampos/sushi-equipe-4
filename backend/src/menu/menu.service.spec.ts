/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuItemDto } from './dto/menu-item.dto';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  // Mock data para testes
  const mockMenuItems: MenuItemDto[] = [
    {
      id: 1,
      name: 'Salmão Sashimi',
      description: 'Fatias frescas de salmão',
      price: 28.9,
      category: 'sashimi',
      available: true,
    },
    {
      id: 2,
      name: 'Atum Sashimi',
      description: 'Fatias frescas de atum',
      price: 32.9,
      category: 'sashimi',
      available: true,
    },
    {
      id: 3,
      name: 'Philadelphia Roll',
      description: 'Sushi com salmão e cream cheese',
      price: 26.9,
      category: 'maki',
      available: false,
    },
  ];

  const mockMenuService = {
    findAll: jest.fn(),
    findAvailable: jest.fn(),
    findByCategory: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: mockMenuService,
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Controller Initialization', () => {
    it('should be defined', () => {
      // Arrange & Act - controller já inicializado no beforeEach
      // Assert
      expect(controller).toBeDefined();
    });

    it('should have menuService injected', () => {
      // Arrange & Act - service já injetado no beforeEach
      // Assert
      expect(service).toBeDefined();
    });
  });

  describe('getMenu()', () => {
    it('should return available items when no category is provided', () => {
      // Arrange
      const expectedItems = mockMenuItems.filter((item) => item.available);
      mockMenuService.findAvailable.mockReturnValue(expectedItems);

      // Act
      const result = controller.getMenu();

      // Assert
      expect(result).toEqual(expectedItems);
      expect(mockMenuService.findAvailable).toHaveBeenCalledTimes(1);
      expect(mockMenuService.findByCategory).not.toHaveBeenCalled();
    });

    it('should return items by category when category is provided', () => {
      // Arrange
      const category = 'sashimi';
      const expectedItems = mockMenuItems.filter(
        (item) => item.category === category && item.available,
      );
      mockMenuService.findByCategory.mockReturnValue(expectedItems);

      // Act
      const result = controller.getMenu(category);

      // Assert
      expect(result).toEqual(expectedItems);
      expect(mockMenuService.findByCategory).toHaveBeenCalledWith(category);
      expect(mockMenuService.findByCategory).toHaveBeenCalledTimes(1);
      expect(mockMenuService.findAvailable).not.toHaveBeenCalled();
    });

    it('should return empty array when category has no available items', () => {
      // Arrange
      const category = 'maki';
      mockMenuService.findByCategory.mockReturnValue([]);

      // Act
      const result = controller.getMenu(category);

      // Assert
      expect(result).toEqual([]);
      expect(mockMenuService.findByCategory).toHaveBeenCalledWith(category);
      expect(mockMenuService.findByCategory).toHaveBeenCalledTimes(1);
    });

    it('should handle empty string category', () => {
      // Arrange
      const category = '';
      mockMenuService.findByCategory.mockReturnValue([]);

      // Act
      const result = controller.getMenu(category);

      // Assert
      expect(result).toEqual([]);
      expect(mockMenuService.findByCategory).toHaveBeenCalledWith(category);
      expect(mockMenuService.findByCategory).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined category parameter', () => {
      // Arrange
      const expectedItems = mockMenuItems.filter((item) => item.available);
      mockMenuService.findAvailable.mockReturnValue(expectedItems);

      // Act
      const result = controller.getMenu(undefined);

      // Assert
      expect(result).toEqual(expectedItems);
      expect(mockMenuService.findAvailable).toHaveBeenCalledTimes(1);
      expect(mockMenuService.findByCategory).not.toHaveBeenCalled();
    });
  });

  describe('getAllMenu()', () => {
    it('should return all menu items', () => {
      // Arrange
      mockMenuService.findAll.mockReturnValue(mockMenuItems);

      // Act
      const result = controller.getAllMenu();

      // Assert
      expect(result).toEqual(mockMenuItems);
      expect(mockMenuService.findAll).toHaveBeenCalledTimes(1);
      expect(result.length).toBe(mockMenuItems.length);
    });

    it('should return empty array when no items exist', () => {
      // Arrange
      mockMenuService.findAll.mockReturnValue([]);

      // Act
      const result = controller.getAllMenu();

      // Assert
      expect(result).toEqual([]);
      expect(mockMenuService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should include both available and unavailable items', () => {
      // Arrange
      mockMenuService.findAll.mockReturnValue(mockMenuItems);

      // Act
      const result = controller.getAllMenu();

      // Assert
      expect(result).toEqual(mockMenuItems);
      expect(result.some((item) => item.available)).toBe(true);
      expect(result.some((item) => !item.available)).toBe(true);
    });
  });

  describe('getMenuItem()', () => {
    it('should return item when valid id is provided', () => {
      // Arrange
      const id = '1';
      const expectedItem = mockMenuItems[0];
      mockMenuService.findById.mockReturnValue(expectedItem);

      // Act
      const result = controller.getMenuItem(id);

      // Assert
      expect(result).toEqual(expectedItem);
      expect(mockMenuService.findById).toHaveBeenCalledWith(1);
      expect(mockMenuService.findById).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when item is not found', () => {
      // Arrange
      const id = '999';
      mockMenuService.findById.mockReturnValue(undefined);

      // Act
      const result = controller.getMenuItem(id);

      // Assert
      expect(result).toBeUndefined();
      expect(mockMenuService.findById).toHaveBeenCalledWith(999);
      expect(mockMenuService.findById).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', () => {
      // Arrange
      const id = '42';
      mockMenuService.findById.mockReturnValue(undefined);

      // Act
      controller.getMenuItem(id);

      // Assert
      expect(mockMenuService.findById).toHaveBeenCalledWith(42);
      expect(mockMenuService.findById).toHaveBeenCalledTimes(1);
    });

    it('should handle zero id', () => {
      // Arrange
      const id = '0';
      mockMenuService.findById.mockReturnValue(undefined);

      // Act
      const result = controller.getMenuItem(id);

      // Assert
      expect(result).toBeUndefined();
      expect(mockMenuService.findById).toHaveBeenCalledWith(0);
      expect(mockMenuService.findById).toHaveBeenCalledTimes(1);
    });

    it('should handle negative id', () => {
      // Arrange
      const id = '-1';
      mockMenuService.findById.mockReturnValue(undefined);

      // Act
      const result = controller.getMenuItem(id);

      // Assert
      expect(result).toBeUndefined();
      expect(mockMenuService.findById).toHaveBeenCalledWith(-1);
      expect(mockMenuService.findById).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid string id', () => {
      // Arrange
      const id = 'invalid';
      mockMenuService.findById.mockReturnValue(undefined);

      // Act
      const result = controller.getMenuItem(id);

      // Assert
      expect(result).toBeUndefined();
      expect(mockMenuService.findById).toHaveBeenCalledWith(NaN);
      expect(mockMenuService.findById).toHaveBeenCalledTimes(1);
    });

    it('should return unavailable item if it exists', () => {
      // Arrange
      const id = '3';
      const expectedItem = mockMenuItems[2]; // item indisponível
      mockMenuService.findById.mockReturnValue(expectedItem);

      // Act
      const result = controller.getMenuItem(id);

      // Assert
      expect(result).toEqual(expectedItem);
      expect(result?.available).toBe(false);
      expect(mockMenuService.findById).toHaveBeenCalledWith(3);
    });
  });
});

describe('MenuService', () => {
  let service: MenuService;

  // Mock data para testes
  const mockMenuItems: MenuItemDto[] = [
    {
      id: 1,
      name: 'Salmão Sashimi',
      description: 'Fatias frescas de salmão',
      price: 28.9,
      category: 'sashimi',
      available: true,
    },
    {
      id: 2,
      name: 'Atum Sashimi',
      description: 'Fatias frescas de atum',
      price: 32.9,
      category: 'sashimi',
      available: true,
    },
    {
      id: 3,
      name: 'Philadelphia Roll',
      description: 'Sushi com salmão e cream cheese',
      price: 26.9,
      category: 'maki',
      available: false,
    },
    {
      id: 4,
      name: 'Nigiri de Salmão',
      description: 'Bolinho de arroz com salmão',
      price: 8.9,
      category: 'nigiri',
      available: true,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuService],
    }).compile();

    service = module.get<MenuService>(MenuService);
    // Mock dos dados para testes isolados
    (service as any).menuItems = mockMenuItems;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      // Arrange & Act - service já inicializado no beforeEach
      // Assert
      expect(service).toBeDefined();
    });

    it('should have menuItems property initialized', () => {
      // Arrange & Act - service já inicializado no beforeEach
      // Assert
      expect((service as any).menuItems).toBeDefined();
      expect(Array.isArray((service as any).menuItems)).toBe(true);
    });
  });

  describe('findAll()', () => {
    it('should return all menu items', () => {
      // Arrange
      const expectedLength = mockMenuItems.length;

      // Act
      const result = service.findAll();

      // Assert
      expect(result).toEqual(mockMenuItems);
      expect(result.length).toBe(expectedLength);
      expect(result).toContain(mockMenuItems[0]);
      expect(result).toContain(mockMenuItems[1]);
      expect(result).toContain(mockMenuItems[2]);
      expect(result).toContain(mockMenuItems[3]);
    });

    it('should return empty array when no items exist', () => {
      // Arrange
      (service as any).menuItems = [];

      // Act
      const result = service.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('findAvailable()', () => {
    it('should return only available items', () => {
      // Arrange
      const expectedAvailableItems = mockMenuItems.filter(
        (item) => item.available,
      );

      // Act
      const result = service.findAvailable();

      // Assert
      expect(result).toEqual(expectedAvailableItems);
      expect(result.length).toBe(3);
      expect(result.every((item) => item.available)).toBe(true);
      expect(result.find((item) => item.id === 3)).toBeUndefined(); // item indisponível
    });

    it('should return empty array when no available items exist', () => {
      // Arrange
      const unavailableItems = mockMenuItems.map((item) => ({
        ...item,
        available: false,
      }));
      (service as any).menuItems = unavailableItems;

      // Act
      const result = service.findAvailable();

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return all items when all are available', () => {
      // Arrange
      const allAvailableItems = mockMenuItems.map((item) => ({
        ...item,
        available: true,
      }));
      (service as any).menuItems = allAvailableItems;

      // Act
      const result = service.findAvailable();

      // Assert
      expect(result).toEqual(allAvailableItems);
      expect(result.length).toBe(mockMenuItems.length);
    });
  });

  describe('findByCategory()', () => {
    it('should return items from specific category that are available', () => {
      // Arrange
      const category = 'sashimi';
      const expectedItems = mockMenuItems.filter(
        (item) => item.category === category && item.available,
      );

      // Act
      const result = service.findByCategory(category);

      // Assert
      expect(result).toEqual(expectedItems);
      expect(result.length).toBe(2);
      expect(result.every((item) => item.category === category)).toBe(true);
      expect(result.every((item) => item.available)).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      // Arrange
      const category = 'nonexistent';

      // Act
      const result = service.findByCategory(category);

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return empty array for category with only unavailable items', () => {
      // Arrange
      const category = 'maki';

      // Act
      const result = service.findByCategory(category);

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle empty string category', () => {
      // Arrange
      const category = '';

      // Act
      const result = service.findByCategory(category);

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle null category gracefully', () => {
      // Arrange
      const category = null as any;

      // Act
      const result = service.findByCategory(category);

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should be case sensitive', () => {
      // Arrange
      const category = 'SASHIMI';

      // Act
      const result = service.findByCategory(category);

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('findById()', () => {
    it('should return item when id exists', () => {
      // Arrange
      const id = 1;
      const expectedItem = mockMenuItems.find((item) => item.id === id);

      // Act
      const result = service.findById(id);

      // Assert
      expect(result).toEqual(expectedItem);
      expect(result?.id).toBe(id);
      expect(result?.name).toBe('Salmão Sashimi');
    });

    it('should return undefined when id does not exist', () => {
      // Arrange
      const id = 999;

      // Act
      const result = service.findById(id);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return item even if it is not available', () => {
      // Arrange
      const id = 3; // item indisponível
      const expectedItem = mockMenuItems.find((item) => item.id === id);

      // Act
      const result = service.findById(id);

      // Assert
      expect(result).toEqual(expectedItem);
      expect(result?.available).toBe(false);
    });

    it('should handle negative id', () => {
      // Arrange
      const id = -1;

      // Act
      const result = service.findById(id);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle zero id', () => {
      // Arrange
      const id = 0;

      // Act
      const result = service.findById(id);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});

describe('MenuItemDto', () => {
  describe('DTO Structure', () => {
    it('should create a valid menu item dto', () => {
      // Arrange
      const menuItemData = {
        id: 1,
        name: 'Salmão Sashimi',
        description: 'Fatias frescas de salmão',
        price: 28.9,
        category: 'sashimi',
        available: true,
      };

      // Act
      const menuItem = new MenuItemDto();
      Object.assign(menuItem, menuItemData);

      // Assert
      expect(menuItem.id).toBe(1);
      expect(menuItem.name).toBe('Salmão Sashimi');
      expect(menuItem.description).toBe('Fatias frescas de salmão');
      expect(menuItem.price).toBe(28.9);
      expect(menuItem.category).toBe('sashimi');
      expect(menuItem.available).toBe(true);
    });

    it('should handle all data types correctly', () => {
      // Arrange
      const menuItemData = {
        id: 999,
        name: 'Test Item',
        description: 'Test Description',
        price: 99.99,
        category: 'test',
        available: false,
      };

      // Act
      const menuItem = new MenuItemDto();
      Object.assign(menuItem, menuItemData);

      // Assert
      expect(typeof menuItem.id).toBe('number');
      expect(typeof menuItem.name).toBe('string');
      expect(typeof menuItem.description).toBe('string');
      expect(typeof menuItem.price).toBe('number');
      expect(typeof menuItem.category).toBe('string');
      expect(typeof menuItem.available).toBe('boolean');
    });

    it('should be instantiable', () => {
      // Arrange & Act
      const menuItem = new MenuItemDto();

      // Assert
      expect(menuItem).toBeInstanceOf(MenuItemDto);
      expect(menuItem).toBeDefined();
    });
  });
});
