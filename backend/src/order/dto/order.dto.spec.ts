import { OrderDto } from './order.dto';

describe('OrderDto', () => {
  describe('DTO Structure', () => {

    it('should create a valid order dto', () => {
      // Arrange
      const orderData = {
        id: 1,
        items: [
          { productId: 5, quantity: 2 },
          { productId: 7, quantity: 1 },
        ],
        total: 150.5,
        createdAt: '2025-07-18T15:00:00.000Z',
      };

      // Act
      const order = new OrderDto();
      Object.assign(order, orderData);

      // Assert
      expect(order.id).toBe(1);
      expect(order.items).toEqual([
        { productId: 5, quantity: 2 },
        { productId: 7, quantity: 1 },
      ]);
      expect(order.total).toBe(150.5);
      expect(order.createdAt).toBe('2025-07-18T15:00:00.000Z');
    });

    it('should handle all data types correctly', () => {
      // Arrange
      const orderData = {
        id: 42,
        items: [{ productId: 9, quantity: 3 }],
        total: 99.0,
        createdAt: '2021-12-01T10:20:30.000Z',
      };

      // Act
      const order = new OrderDto();
      Object.assign(order, orderData);

      // Assert
      expect(typeof order.id).toBe('number');
      expect(Array.isArray(order.items)).toBe(true);
      expect(typeof order.items[0].productId).toBe('number');
      expect(typeof order.items[0].quantity).toBe('number');
      expect(typeof order.total).toBe('number');
      expect(typeof order.createdAt).toBe('string');
    });

    it('should be instantiable', () => {
      // Arrange & Act
      const order = new OrderDto();

      // Assert
      expect(order).toBeInstanceOf(OrderDto);
      expect(order).toBeDefined();
    });

  });
});
