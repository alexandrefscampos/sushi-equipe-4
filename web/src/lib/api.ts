const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export const api = {
  async getMenuItems(category?: string): Promise<MenuItem[]> {
    const url = category 
      ? `${API_BASE_URL}/menu?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/menu`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.statusText}`);
    }
    return response.json();
  },

  async getAllMenuItems(): Promise<MenuItem[]> {
    const response = await fetch(`${API_BASE_URL}/menu/all`);
    if (!response.ok) {
      throw new Error(`Failed to fetch all menu items: ${response.statusText}`);
    }
    return response.json();
  },

  async getMenuItem(id: number): Promise<MenuItem | null> {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch menu item: ${response.statusText}`);
    }
    return response.json();
  },
}; 