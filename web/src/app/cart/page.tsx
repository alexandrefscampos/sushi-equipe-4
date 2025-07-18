"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

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

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Philadelphia",
    description: "Arroz, nori, salmão, cream cheese",
    price: 24.9,
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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([
    { product: sampleProducts[0], quantity: 1 },
    { product: sampleProducts[1], quantity: 1 },
  ]);
  const [couponCode, setCouponCode] = useState("");

  const deliveryFee = 6.0;
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const applyCoupon = () => {
    alert("Funcionalidade de cupom será implementada");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/menu" className={styles.backButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className={styles.title}>Carrinho de Compras</h1>
        <div></div>
      </header>

      <main className={styles.main}>
        <section className={styles.cartItems}>
          {cart.map((item) => (
            <div key={item.product.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
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
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.product.name}</h3>
                <div className={styles.itemPricing}>
                  <span className={styles.itemPrice}>
                    {formatPrice(item.product.price)}
                  </span>
                  <span className={styles.itemTotal}>
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
              <div className={styles.quantityControls}>
                <button
                  className={styles.quantityButton}
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span className={styles.quantity}>{item.quantity}</span>
                <button
                  className={styles.quantityButton}
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.couponSection}>
          <div className={styles.couponInput}>
            <input
              type="text"
              placeholder="Digite seu cupom aqui"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className={styles.couponField}
            />
            <button onClick={applyCoupon} className={styles.couponButton}>
              Aplicar
            </button>
          </div>
        </section>

        <section className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Resumo do Pedido</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Taxa entrega:</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </section>

        <section className={styles.deliveryInfo}>
          <div className={styles.addressRow}>
            <span>Rua das Laranjeiras, 123</span>
            <button className={styles.editButton}>Editar</button>
          </div>
          <div className={styles.timeRow}>
            <span>Tempo estimado:</span>
            <span>35-45 min</span>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <button className={styles.checkoutButton}>Finalizar Pedido</button>
      </footer>
    </div>
  );
}
