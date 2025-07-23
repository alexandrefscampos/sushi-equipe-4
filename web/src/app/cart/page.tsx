"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const [couponCode, setCouponCode] = useState("");

  const { cart, removeFromCart, addToCart, clearCart } = useCart();

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

  const updateQuantity = (productId: number, newQuantity: number) => {
    const currentItem = cart.find((item) => item.product.id === productId);
    if (!currentItem) return;

    if (newQuantity <= 0) {
      // Remove completely by calling removeFromCart multiple times
      for (let i = 0; i < currentItem.quantity; i++) {
        removeFromCart(productId);
      }
    } else if (newQuantity > currentItem.quantity) {
      // Add items
      for (let i = currentItem.quantity; i < newQuantity; i++) {
        addToCart(currentItem.product);
      }
    } else if (newQuantity < currentItem.quantity) {
      // Remove items
      for (let i = newQuantity; i < currentItem.quantity; i++) {
        removeFromCart(productId);
      }
    }
  };

  const applyCoupon = () => {
    alert("Funcionalidade de cupom será implementada");
  };

  const handleCheckout = () => {
    alert(`Pedido finalizado com sucesso! Total: ${formatPrice(total)}`);
    // In a real app, this would send the order to the backend
    // For now, we'll just clear the cart
    setTimeout(() => {
      clearCart();
    }, 1000);
  };

  if (cart.length === 0) {
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
          <div className={styles.emptyCart}>
            <p>Seu carrinho está vazio</p>
            <Link href="/menu" className={styles.backToMenuButton}>
              Voltar ao Menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
            <span>Endereço de entrega:</span>
            <button className={styles.editButton}>Editar</button>
          </div>
          <div className={styles.timeRow}>
            <span>Tempo estimado:</span>
            <span>30-45 min</span>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <button className={styles.checkoutButton} onClick={handleCheckout}>
          Finalizar Pedido - {formatPrice(total)}
        </button>
      </footer>
    </div>
  );
}
