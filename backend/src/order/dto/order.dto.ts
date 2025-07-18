export interface OrderDto {
  id: number;
  items: { productId: number; quantity: number }[];
  total: number;
  createdAt: string;
}
