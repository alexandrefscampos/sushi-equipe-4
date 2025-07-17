"use client";

import { useState } from "react";
import styles from "./sushi-menu.module.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "sushis" | "combos" | "pratos-quentes";
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const products: Product[] = [
  {
    id: "1",
    name: "Philadelphia",
    description: "Arroz, nori, salmão, cream cheese",
    price: 24.9,
    category: "sushis",
  },
  {
    id: "2",
    name: "Hot Roll",
    description: "Salmão empanado, cream cheese",
    price: 23.9,
    category: "sushis",
  },
  {
    id: "3",
    name: "Combo 16 peças",
    description: "4 hossomakis, 4 nigiris, 8 uramakis",
    price: 49.9,
    category: "combos",
  },
];

const categories = [
  { id: "sushis", label: "Sushis" },
  { id: "combos", label: "Combos" },
  { id: "pratos-quentes", label: "Pratos Quentes" },
] as const;

export default function SushiMenu() {
  const [activeCategory, setActiveCategory] = useState<string>("sushis");
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 1 },
  ]);

  const filteredProducts = products.filter((product) =>
    activeCategory === "sushis"
      ? product.category === "sushis" || product.category === "combos"
      : product.category === activeCategory
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === productId
      );

      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter((item) => item.product.id !== productId);
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getProductQuantityInCart = (productId: string) => {
    const cartItem = cart.find((item) => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sushi House</h1>
        <button className={styles.searchButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </header>

      <nav className={styles.categoryNav}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${
              activeCategory === category.id ? styles.active : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <main className={styles.productList}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImage}>
              <div className={styles.imagePlaceholder}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12,5 19,12 12,19" />
                </svg>
              </div>
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>
            </div>
            <div className={styles.productPrice}>
              {formatPrice(product.price)}
            </div>
          </div>
        ))}
      </main>

      <footer className={styles.cartSummary}>
        <button className={styles.cartButton}>
          Ver Carrinho ({cartItemCount}) - {formatPrice(cartTotal)}
        </button>
      </footer>
    </div>
  );
}
