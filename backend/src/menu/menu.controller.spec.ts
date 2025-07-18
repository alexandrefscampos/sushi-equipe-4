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
