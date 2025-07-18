import { api } from '../api';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API utilities', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('getMenuItems', () => {
    it('should fetch menu items without category', async () => {
      const mockData = [
        {
          id: 1,
          name: 'Salmão Sashimi',
          description: 'Fatias frescas de salmão',
          price: 28.9,
          category: 'sashimi',
          available: true,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await api.getMenuItems();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/menu');
      expect(result).toEqual(mockData);
    });

    it('should fetch menu items with category filter', async () => {
      const mockData = [
        {
          id: 1,
          name: 'Salmão Sashimi',
          description: 'Fatias frescas de salmão',
          price: 28.9,
          category: 'sashimi',
          available: true,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await api.getMenuItems('sashimi');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/menu?category=sashimi'
      );
      expect(result).toEqual(mockData);
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(api.getMenuItems()).rejects.toThrow(
        'Failed to fetch menu items: Internal Server Error'
      );
    });
  });

  describe('getAllMenuItems', () => {
    it('should fetch all menu items', async () => {
      const mockData = [
        {
          id: 1,
          name: 'Salmão Sashimi',
          description: 'Fatias frescas de salmão',
          price: 28.9,
          category: 'sashimi',
          available: true,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await api.getAllMenuItems();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/menu/all');
      expect(result).toEqual(mockData);
    });
  });

  describe('getMenuItem', () => {
    it('should fetch single menu item', async () => {
      const mockData = {
        id: 1,
        name: 'Salmão Sashimi',
        description: 'Fatias frescas de salmão',
        price: 28.9,
        category: 'sashimi',
        available: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await api.getMenuItem(1);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/menu/1');
      expect(result).toEqual(mockData);
    });

    it('should return null for 404 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await api.getMenuItem(999);

      expect(result).toBeNull();
    });

    it('should throw error for other failed requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(api.getMenuItem(1)).rejects.toThrow(
        'Failed to fetch menu item: Internal Server Error'
      );
    });
  });
}); 