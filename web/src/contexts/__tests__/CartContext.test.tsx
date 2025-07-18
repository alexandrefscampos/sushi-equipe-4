import React from "react";
import { render, renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../CartContext";
import { MenuItem } from "@/lib/api";

const mockMenuItem: MenuItem = {
  id: 1,
  name: "Salmão Sashimi",
  description: "Fatias frescas de salmão",
  price: 28.9,
  category: "sashimi",
  available: true,
};

const mockMenuItem2: MenuItem = {
  id: 2,
  name: "Atum Sashimi",
  description: "Fatias frescas de atum",
  price: 32.9,
  category: "sashimi",
  available: true,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("CartContext", () => {
  it("should provide initial empty cart state", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toEqual([]);
    expect(result.current.cartTotal).toBe(0);
    expect(result.current.cartItemCount).toBe(0);
  });

  it("should add item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toEqual({
      product: mockMenuItem,
      quantity: 1,
    });
    expect(result.current.cartTotal).toBe(28.9);
    expect(result.current.cartItemCount).toBe(1);
  });

  it("should increase quantity when adding existing item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.cartTotal).toBe(57.8);
    expect(result.current.cartItemCount).toBe(2);
  });

  it("should add multiple different items to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem2);
    });

    expect(result.current.cart).toHaveLength(2);
    expect(result.current.cartTotal).toBe(61.8);
    expect(result.current.cartItemCount).toBe(2);
  });

  it("should remove item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.cart[0].quantity).toBe(2);

    act(() => {
      result.current.removeFromCart(mockMenuItem.id);
    });

    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.cartTotal).toBe(28.9);
    expect(result.current.cartItemCount).toBe(1);
  });

  it("should remove item completely when quantity reaches 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.cart).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(mockMenuItem.id);
    });

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.cartTotal).toBe(0);
    expect(result.current.cartItemCount).toBe(0);
  });

  it("should clear entire cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem2);
    });

    expect(result.current.cart).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.cartTotal).toBe(0);
    expect(result.current.cartItemCount).toBe(0);
  });

  it("should get correct quantity for item in cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.getProductQuantityInCart(mockMenuItem.id)).toBe(0);

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.getProductQuantityInCart(mockMenuItem.id)).toBe(2);
    expect(result.current.getProductQuantityInCart(mockMenuItem2.id)).toBe(0);
  });

  it("should throw error when used outside provider", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useCart());
    }).toThrow("useCart must be used within a CartProvider");

    consoleSpy.mockRestore();
  });
});
