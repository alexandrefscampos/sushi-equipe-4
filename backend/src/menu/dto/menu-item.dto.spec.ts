import { MenuItemDto } from './menu-item.dto';

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
